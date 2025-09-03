import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ToolsModule } from './tools/tools.module';
import { LlmModule } from './llm/llm.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [ToolsModule, LlmModule, AgentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
