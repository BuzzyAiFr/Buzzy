import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LlmService } from './llm.service';

/**
 * The module responsible for all LLM-related functionalities.
 * It configures the ConfigModule to load environment variables and provides
 * the LlmService to be used across the application.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the config service available globally
      envFilePath: '.env', // Specify the path to the .env file
    }),
  ],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
