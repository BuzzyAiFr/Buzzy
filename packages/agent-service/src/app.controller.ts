import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AgentOrchestratorService } from './agent/agent-orchestrator.service';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AgentProfileRepository } from './agent/agent-profile.repository';

class ExecuteTaskDto {
  @IsString()
  @IsNotEmpty()
  objective: string;

  @IsUUID()
  @IsOptional()
  agentId?: string;
}

@Controller()
export class AppController {
  private defaultAgentId: string;

  constructor(
    private readonly appService: AppService,
    private readonly agentOrchestratorService: AgentOrchestratorService,
    private readonly agentProfileRepository: AgentProfileRepository,
  ) {
    // Find and store the ID of the first (default) agent on startup
    this.defaultAgentId = this.agentProfileRepository.findAll()[0]?.id;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('agent/execute-task')
  async executeTask(@Body() body: ExecuteTaskDto): Promise<any> {
    const agentId = body.agentId || this.defaultAgentId;
    return this.agentOrchestratorService.executeTask(body.objective, agentId);
  }
}
