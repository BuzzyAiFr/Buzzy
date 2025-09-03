import { z } from 'zod';

/**
 * Zod schema for an Agent's Profile.
 * This defines the identity, role, and goals of an agent.
 */
export const AgentProfileSchema = z.object({
  id: z.string().uuid().describe('The unique identifier for the agent.'),
  name: z.string().describe("The agent's name."),
  role: z
    .string()
    .describe(
      'The role or persona of the agent. This will be used as the main system prompt.',
    ),
  goals: z
    .array(z.string())
    .describe('A list of high-level goals for the agent.'),
});

// Infer the TypeScript type from the Zod schema.
export type AgentProfile = z.infer<typeof AgentProfileSchema>;
