import { Injectable } from '@nestjs/common';
import {
  Memory,
  MemoryMessage,
  MemoryMessageRole,
} from './memory.interface';

/**
 * A service for managing the short-term memory of agent tasks.
 * This implementation uses an in-memory map to store conversation histories.
 */
@Injectable()
export class MemoryService {
  // A map where the key is the taskId and the value is the memory session.
  private readonly sessions = new Map<string, Memory>();

  /**
   * Creates and initializes a new memory session for a task.
   * @param taskId The unique ID of the task.
   * @returns The newly created memory session.
   */
  startSession(taskId: string): Memory {
    const newSession: Memory = {
      taskId,
      messages: [],
    };
    this.sessions.set(taskId, newSession);
    return newSession;
  }

  /**
   * Adds a message to a task's memory session.
   * @param taskId The ID of the task.
   * @param role The role of the message sender.
   * @param content The content of the message.
   * @returns The updated memory session.
   */
  addMessage(
    taskId: string,
    role: MemoryMessageRole,
    content: string,
  ): Memory {
    const session = this.getSession(taskId);
    const message: MemoryMessage = {
      role,
      content,
      timestamp: new Date(),
    };
    session.messages.push(message);
    return session;
  }

  /**
   * Retrieves the full conversation history for a task.
   * @param taskId The ID of the task.
   * @returns The array of messages for the task.
   */
  getHistory(taskId: string): MemoryMessage[] {
    const session = this.getSession(taskId);
    return session.messages;
  }

  /**
   * Retrieves a memory session, creating it if it doesn't exist.
   * @param taskId The ID of the task.
   * @returns The memory session.
   */
  private getSession(taskId: string): Memory {
    let session = this.sessions.get(taskId);
    if (!session) {
      session = this.startSession(taskId);
    }
    return session;
  }
}
