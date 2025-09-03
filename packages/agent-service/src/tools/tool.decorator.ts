import { SetMetadata } from '@nestjs/common';
import { z } from 'zod';

/**
 * A unique symbol used as a key to store and retrieve tool metadata.
 * Using a symbol prevents key collisions with other metadata in the application.
 */
export const TOOL_METADATA_KEY = Symbol('buzzy:tool');

/**
 * Defines the metadata structure for a tool. This is the information
 * that will be passed to the @Tool() decorator.
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodObject<any>;
  outputSchema: z.ZodObject<any>;
}

/**
 * A custom method decorator that marks a class method as a Buzzy "Tool".
 *
 * @param definition The metadata that defines the tool's contract.
 * @returns A decorator function that attaches the metadata to the method.
 */
export const Tool = (definition: ToolDefinition) =>
  SetMetadata(TOOL_METADATA_KEY, definition);
