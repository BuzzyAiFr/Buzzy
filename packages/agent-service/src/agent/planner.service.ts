import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ToolRegistry } from '../tools/tool.registry';
import { Tool } from '../tools/tool.interface';
import { Plan, PlanSchema } from './plan.interface';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { AgentProfile } from './agent-profile.interface';
import { MemoryService } from './memory.service';
import { ChatCompletionMessageParam } from 'litellm/types';

@Injectable()
export class PlannerService {
  private readonly logger = new Logger(PlannerService.name);

  constructor(
    private readonly llmService: LlmService,
    private readonly toolRegistry: ToolRegistry,
    private readonly memoryService: MemoryService,
  ) {}

  /**
   * Creates a structured plan to achieve a given objective.
   * @param objective The user's high-level goal.
   * @param profile The profile of the agent that will execute the plan.
   * @param taskId The ID of the current task, used to retrieve conversation history.
   * @returns A promise that resolves to a structured plan.
   */
  async createPlan(
    objective: string,
    profile: AgentProfile,
    taskId: string,
  ): Promise<Plan> {
    const tools = this.toolRegistry.getAllTools();
    const systemPrompt = this.buildSystemPrompt(tools, profile);
    const history = this.memoryService.getHistory(taskId);

    // Convert our memory format to the format LiteLLM expects.
    const messages: ChatCompletionMessageParam[] = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add the system prompt as the first message.
    messages.unshift({ role: 'system', content: systemPrompt });

    this.logger.log(
      `Generating plan for objective: "${objective}" with ${history.length} history messages.`,
    );

    const responseJson = await this.llmService.completion(messages);

    this.logger.log('Received response from LLM, parsing and validating plan...');
    const plan = this.parseAndValidatePlan(responseJson);
    this.logger.log(`Plan generated with ${plan.steps.length} steps.`);

    return plan;
  }

  /**
   * Parses the LLM's JSON response and validates it against the PlanSchema.
   * @param jsonString The JSON string response from the LLM.
   * @returns A validated Plan object.
   */
  private parseAndValidatePlan(jsonString: string): Plan {
    try {
      // The LLM might return a JSON string with extra text or code blocks.
      const sanitizedJson = jsonString.match(/```json\n([\s\S]*?)\n```/)?.[1] || jsonString;
      const parsed = JSON.parse(sanitizedJson);
      return PlanSchema.parse(parsed);
    } catch (error) {
      this.logger.error('Failed to parse or validate the plan from LLM response.', {
        jsonString,
        error,
      });
      throw new Error('Could not generate a valid plan.');
    }
  }

  /**
   * Builds the system prompt to guide the LLM in creating a plan.
   * @param tools A list of available tools.
   * @param profile The profile of the agent.
   * @returns The system prompt string.
   */
  private buildSystemPrompt(tools: Tool[], profile: AgentProfile): string {
    const toolDefinitions = tools
      .map((tool) => {
        // Use zod-to-json-schema to get a JSON schema representation of the Zod schema
        const inputJsonSchema = zodToJsonSchema(tool.inputSchema, {
          name: `${tool.name}_input`,
          errorMessages: true,
        });
        return `
- Tool: ${tool.name}
  Description: ${tool.description}
  Input Schema: ${JSON.stringify(inputJsonSchema, null, 2)}
`;
      })
      .join('');

    return `
${profile.role}

Your high-level goals are: ${profile.goals.join(', ')}.

You have access to the following tools to achieve the user's objective:
${toolDefinitions}

You must respond with a JSON object that strictly follows this schema:
${JSON.stringify(zodToJsonSchema(PlanSchema), null, 2)}

- The 'steps' array should contain the sequence of tool calls.
- For each step, provide the 'tool' name, the 'inputs' object, and a brief 'reasoning' for why this step is necessary.
- Only use the tools provided. Do not invent new tools.
- Ensure the inputs for each tool call strictly match its input schema.
- Think step-by-step. The plan should be logical and efficient.
- Your final response must be ONLY the JSON object, enclosed in \`\`\`json code blocks.
    `;
  }
}
