import { z } from 'zod';

/**
 * Defines the possible roles in a conversation history.
 * - user: The initial prompt or a correction from the user.
 * - assistant: The agent's own thoughts, plans, or responses.
 * - tool: The result of a tool execution.
 */
export const MemoryMessageRoleSchema = z.enum(['user', 'assistant', 'tool']);
export type MemoryMessageRole = z.infer<typeof MemoryMessageRoleSchema>;

/**
 * Zod schema for a single message/event in the agent's short-term memory.
 */
export const MemoryMessageSchema = z.object({
  role: MemoryMessageRoleSchema,
  content: z.string().describe('The content of the message.'),
  timestamp: z.date().describe('The time the message was recorded.'),
});

export type MemoryMessage = z.infer<typeof MemoryMessageSchema>;

/**
 * Zod schema for a full conversation history/memory session.
 */
export const MemorySchema = z.object({
  taskId: z.string().uuid(),
  messages: z.array(MemoryMessageSchema),
});

export type Memory = z.infer<typeof MemorySchema>;
