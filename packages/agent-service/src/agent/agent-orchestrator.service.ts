import { Injectable, Logger } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { ExecutorService } from './executor.service';

/**
 * Orchestrates the entire agent workflow, from planning to execution.
 * This is the main entry point for running a task.
 */
@Injectable()
export class AgentOrchestratorService {
  private readonly logger = new Logger(AgentOrchestratorService.name);

  constructor(
    private readonly plannerService: PlannerService,
    private readonly executorService: ExecutorService,
  ) {}

  /**
   * Executes a high-level objective by generating a plan and then executing it.
   * @param objective The user's goal.
   * @returns The results of the plan execution.
   */
  async executeTask(objective: string): Promise<any> {
    this.logger.log(`Received new task objective: "${objective}"`);

    // 1. Plan
    const plan = await this.plannerService.createPlan(objective);
    this.logger.log('Generated plan:', JSON.stringify(plan, null, 2));

    // 2. Execute
    const results = await this.executorService.executePlan(plan);
    this.logger.log('Task execution completed.');

    return {
      objective,
      plan,
      results,
    };
  }
}
