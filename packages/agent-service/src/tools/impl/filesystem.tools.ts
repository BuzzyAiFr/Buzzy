import { Injectable, Logger } from '@nestjs/common';
import { Tool } from '../tool.decorator';
import { z } from 'zod';
import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * A service that provides tools for interacting with the file system.
 * Each method decorated with @Tool() will be automatically registered
 * as a usable tool for the agents.
 */
@Injectable()
export class FileSystemTools {
  private readonly logger = new Logger(FileSystemTools.name);

  // Define a secure base path to prevent agents from accessing sensitive files.
  // For now, we'll use a 'workspace' directory in the project root.
  private readonly basePath = path.resolve(process.cwd(), 'workspace');

  constructor() {
    // Ensure the base workspace directory exists
    fs.mkdir(this.basePath, { recursive: true }).catch(this.logger.error);
  }

  /**
   * Resolves a user-provided path against the secure base path.
   * Throws an error if the path attempts to escape the workspace (directory traversal).
   */
  private getSafePath(userPath: string): string {
    const resolvedPath = path.resolve(this.basePath, userPath);
    if (!resolvedPath.startsWith(this.basePath)) {
      throw new Error(`Path traversal detected. Access is restricted to the workspace directory.`);
    }
    return resolvedPath;
  }

  @Tool({
    name: 'filesystem.readFile',
    description: 'Reads the entire content of a file at the given path. The path must be relative to the workspace.',
    inputSchema: z.object({
      path: z.string().describe('The relative path to the file.'),
    }),
    outputSchema: z.object({
      content: z.string().describe('The content of the file.'),
    }),
  })
  async readFile(inputs: { path: string }): Promise<{ content: string }> {
    const safePath = this.getSafePath(inputs.path);
    this.logger.log(`Reading file at: ${safePath}`);
    const content = await fs.readFile(safePath, 'utf-8');
    return { content };
  }

  @Tool({
    name: 'filesystem.writeFile',
    description: 'Writes content to a file at the given path, creating the file if it does not exist. The path must be relative to the workspace.',
    inputSchema: z.object({
      path: z.string().describe('The relative path to the file.'),
      content: z.string().describe('The content to write to the file.'),
    }),
    outputSchema: z.object({
      success: z.boolean().describe('Whether the write operation was successful.'),
    }),
  })
  async writeFile(inputs: { path: string; content: string }): Promise<{ success: boolean }> {
    const safePath = this.getSafePath(inputs.path);
    await fs.mkdir(path.dirname(safePath), { recursive: true });
    this.logger.log(`Writing to file at: ${safePath}`);
    await fs.writeFile(safePath, inputs.content, 'utf-8');
    return { success: true };
  }

  @Tool({
    name: 'filesystem.createDirectory',
    description: 'Creates a directory at the given path, including any necessary parent directories. The path must be relative to the workspace.',
    inputSchema: z.object({
      path: z.string().describe('The relative path of the directory to create.'),
    }),
    outputSchema: z.object({
      success: z.boolean().describe('Whether the directory creation was successful.'),
    }),
  })
  async createDirectory(inputs: { path: string }): Promise<{ success: boolean }> {
    const safePath = this.getSafePath(inputs.path);
    this.logger.log(`Creating directory at: ${safePath}`);
    await fs.mkdir(safePath, { recursive: true });
    return { success: true };
  }
}
