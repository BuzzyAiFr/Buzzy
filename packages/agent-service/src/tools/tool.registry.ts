import { Injectable, Logger } from '@nestjs/common';
import { Tool } from './tool.interface';

/**
 * A singleton service responsible for discovering, storing, and providing
 * access to all available tools in the application.
 *
 * This is the central repository for agent capabilities.
 */
@Injectable()
export class ToolRegistry {
  private readonly logger = new Logger(ToolRegistry.name);
  private readonly tools = new Map<string, Tool>();

  /**
   * Registers a new tool in the registry.
   * If a tool with the same name already exists, it will be overwritten.
   * @param tool The tool instance to register.
   */
  registerTool(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      this.logger.warn(`Tool with name "${tool.name}" is already registered. Overwriting.`);
    }
    this.tools.set(tool.name, tool);
    this.logger.log(`Tool registered: ${tool.name}`);
  }

  /**
   * Retrieves a tool by its unique name.
   * @param name The name of the tool to retrieve.
   * @returns The tool instance, or undefined if not found.
   */
  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  /**
   * Retrieves a list of all registered tools.
   * @returns An array of all tool instances.
   */
  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }
}
