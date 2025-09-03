import { Module } from '@nestjs/common';
import { LlmModule } from '../llm/llm.module';
import { ToolsModule } from '../tools/tools.module';
import { PlannerService } from './planner.service';
import { ExecutorService } from './executor.service';
import { AgentOrchestratorService } from './agent-orchestrator.service';
import { AgentProfileRepository } from './agent-profile.repository';
import { MemoryService } from './memory.service';

@Module({
  imports: [LlmModule, ToolsModule],
  providers: [
    PlannerService,
    ExecutorService,
    AgentOrchestratorService,
    AgentProfileRepository,
    MemoryService,
  ],
  exports: [
    PlannerService,
    ExecutorService,
    AgentOrchestratorService,
    AgentProfileRepository,
    MemoryService,
  ],
})
export class AgentModule {}
