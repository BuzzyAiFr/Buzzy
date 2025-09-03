import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ToolRegistry } from '../tools/tool.registry';
import { Tool } from '../tools/tool.interface';
import { Plan, PlanSchema } from './plan.interface';
import { zodToJsonSchema } from 'zod-to-json-schema';

@Injectable()
export class PlannerService {
  private readonly logger = new Logger(PlannerService.name);

  constructor(
    private readonly llmService: LlmService,
    private readonly toolRegistry: ToolRegistry,
  ) {}

  /**
   * Creates a structured plan to achieve a given objective.
   * @param objective The user's high-level goal.
   * @returns A promise that resolves to a structured plan.
   */
  async createPlan(objective: string): Promise<Plan> {
    const tools = this.toolRegistry.getAllTools();
    const systemPrompt = this.buildSystemPrompt(tools);

    this.logger.log(`Generating plan for objective: "${objective}"`);

    const responseJson = await this.llmService.completion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `The user's objective is: "${objective}"` },
    ]);

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
   * @returns The system prompt string.
   */
  private buildSystemPrompt(tools: Tool[]): string {
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
You are an expert AI agent orchestrator. Your task is to take a user's objective and create a step-by-step plan to achieve it using a set of available tools.

You have access to the following tools:
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
