import { z } from 'zod';

/**
 * Defines the schema for a parameter of a tool, including its name, type,
 * description, and whether it's required.
 * This uses Zod to allow for robust validation.
 */
export const ToolParameterSchema = z.object({
  name: z.string(),
  description: z.string(),
  required: z.boolean().default(true),
});

export type ToolParameter = z.infer<typeof ToolParameterSchema>;

/**
 * Represents the definition of a tool that can be executed by an agent.
 * It's the equivalent of the `node.config.js` from the previous version of Buzzy.
 */
export interface Tool {
  /**
   * The unique name of the tool, in the format `category.action`.
   * e.g., 'filesystem.readFile'
   */
  name: string;

  /**
   * A clear and concise description of what the tool does.
   * This is critical for the LLM to decide when to use the tool.
   */
  description: string;

  /**
   * The schema defining the input parameters for the tool.
   * Using Zod for powerful validation.
   */
  inputSchema: z.ZodObject<any>;

  /**
   * The schema defining the output of the tool.
   */
  outputSchema: z.ZodObject<any>;

  /**
   * The function to execute when the tool is called.
   * @param inputs The validated input parameters.
   * @returns The output of the tool.
   */
  execute: (inputs: any) => Promise<any>;
}
