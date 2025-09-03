import { z } from 'zod';

/**
 * Zod schema for a single step in an execution plan.
 * A step consists of the name of the tool to be called and the inputs to that tool.
 */
export const PlanStepSchema = z.object({
  tool: z.string().describe('The name of the tool to be executed.'),
  inputs: z
    .record(z.any())
    .describe('An object containing the parameters for the tool.'),
  reasoning: z
    .string()
    .describe('A brief explanation of why this step is necessary.'),
});

/**
 * Zod schema for a full execution plan.
 * A plan is an array of steps.
 */
export const PlanSchema = z.object({
  steps: z.array(PlanStepSchema),
});

// We can infer the TypeScript types directly from the Zod schemas.
export type PlanStep = z.infer<typeof PlanStepSchema>;
export type Plan = z.infer<typeof PlanSchema>;
