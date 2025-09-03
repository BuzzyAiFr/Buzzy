import { Injectable, Logger } from '@nestjs/common';
import { ToolRegistry } from '../tools/tool.registry';
import { Plan, PlanStep } from './plan.interface';

@Injectable()
export class ExecutorService {
  private readonly logger = new Logger(ExecutorService.name);

  constructor(private readonly toolRegistry: ToolRegistry) {}

  /**
   * Executes a given plan step by step.
   * @param plan The plan to execute.
   * @returns A list of outputs from each step.
   */
  async executePlan(plan: Plan): Promise<any[]> {
    this.logger.log(`Starting execution of plan with ${plan.steps.length} steps.`);
    const results = [];

    for (const step of plan.steps) {
      this.logger.log(`Executing step: ${step.tool}`);
      const result = await this.executeStep(step);
      results.push(result);
    }

    this.logger.log('Plan execution finished.');
    return results;
  }

  /**
   * Executes a single step of a plan.
   * @param step The PlanStep to execute.
   * @returns The output of the executed tool.
   */
  private async executeStep(step: PlanStep): Promise<any> {
    const tool = this.toolRegistry.getTool(step.tool);

    if (!tool) {
      this.logger.error(`Tool not found: ${step.tool}`);
      throw new Error(`Tool not found: ${step.tool}`);
    }

    try {
      // Validate the inputs provided by the plan against the tool's schema.
      // This is a critical security and stability measure.
      const validatedInputs = tool.inputSchema.parse(step.inputs);
      this.logger.log(`Executing tool "${step.tool}" with inputs:`, validatedInputs);

      const output = await tool.execute(validatedInputs);

      // Optionally, validate the output as well.
      const validatedOutput = tool.outputSchema.parse(output);
      this.logger.log(`Tool "${step.tool}" executed successfully.`);

      return validatedOutput;
    } catch (error) {
      this.logger.error(`Error executing tool "${step.tool}":`, {
        tool: step.tool,
        inputs: step.inputs,
        error: error.message,
      });
      // Re-throw to be handled by the orchestrator.
      throw error;
    }
  }
}
