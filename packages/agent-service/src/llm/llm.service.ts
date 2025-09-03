import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import litellm from 'litellm';
import { ChatCompletionMessageParam } from 'litellm/types';

/**
 * A service to interact with Large Language Models using LiteLLM.
 * It abstracts the details of the LLM calls and handles configuration.
 */
@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    // Get the model name from environment variables, with a fallback.
    this.model = this.configService.get<string>('LLM_MODEL', 'gpt-3.5-turbo');
    this.logger.log(`LLM Service initialized with model: ${this.model}`);
  }

  /**
   * Generates a completion from the configured LLM.
   *
   * @param messages A list of messages forming the conversation history or prompt.
   * @returns The content of the LLM's response message as a string.
   */
  async completion(messages: ChatCompletionMessageParam[]): Promise<string> {
    try {
      this.logger.log(`Sending completion request to model: ${this.model}`);
      const response = await litellm.completion({
        model: this.model,
        messages,
      });
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('LLM response did not contain content.');
      }
      this.logger.log('Received LLM response successfully.');
      return content;
    } catch (error) {
      this.logger.error('Error during LLM completion:', error);
      // Re-throw the error to be handled by the caller
      throw error;
    }
  }
}
