import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AgentOrchestratorService } from './agent/agent-orchestrator.service';

class ExecuteTaskDto {
  objective: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly agentOrchestratorService: AgentOrchestratorService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('agent/execute-task')
  async executeTask(@Body() body: ExecuteTaskDto): Promise<any> {
    return this.agentOrchestratorService.executeTask(body.objective);
  }
}
