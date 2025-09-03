import { Injectable, Logger } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { ExecutorService } from './executor.service';
import { AgentProfileRepository } from './agent-profile.repository';
import { MemoryService } from './memory.service';
import { v4 as uuidv4 } from 'uuid';

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
    private readonly agentProfileRepository: AgentProfileRepository,
    private readonly memoryService: MemoryService,
  ) {}

  /**
   * Executes a high-level objective by generating a plan and then executing it.
   * @param objective The user's goal.
   * @param agentId The ID of the agent profile to use.
   * @returns The results of the plan execution.
   */
  async executeTask(objective: string, agentId: string): Promise<any> {
    const taskId = uuidv4();
    this.logger.log(
      `Received new task objective: "${objective}" for agent ${agentId} (Task ID: ${taskId})`,
    );

    // 1. Initialize session and fetch profile
    this.memoryService.startSession(taskId);
    this.memoryService.addMessage(taskId, 'user', objective);
    const agentProfile = this.agentProfileRepository.findById(agentId);
    this.logger.log(`Using agent profile: ${agentProfile.name}`);

    // 2. Plan
    const plan = await this.plannerService.createPlan(
      objective,
      agentProfile,
      taskId,
    );
    this.memoryService.addMessage(
      taskId,
      'assistant',
      `I have created a plan to achieve the objective:\n${JSON.stringify(
        plan,
        null,
        2,
      )}`,
    );
    this.logger.log('Generated plan:', JSON.stringify(plan, null, 2));

    // 3. Execute
    const results = await this.executorService.executePlan(plan);
    this.memoryService.addMessage(
      taskId,
      'tool',
      `The execution of the plan returned the following results:\n${JSON.stringify(
        results,
        null,
        2,
      )}`,
    );
    this.logger.log('Task execution completed.');

    return {
      taskId,
      objective,
      agentProfile,
      plan,
      results,
    };
  }
}
