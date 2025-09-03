import { Module } from '@nestjs/common';
import { LlmModule } from '../llm/llm.module';
import { ToolsModule } from '../tools/tools.module';
import { PlannerService } from './planner.service';
import { ExecutorService } from './executor.service';
import { AgentOrchestratorService } from './agent-orchestrator.service';

@Module({
  imports: [LlmModule, ToolsModule],
  providers: [PlannerService, ExecutorService, AgentOrchestratorService],
  exports: [PlannerService, ExecutorService, AgentOrchestratorService],
})
export class AgentModule {}
