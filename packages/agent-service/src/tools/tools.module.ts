import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, Reflector } from '@nestjs/core';
import { ToolRegistry } from './tool.registry';
import { TOOL_METADATA_KEY, ToolDefinition } from './tool.decorator';
import { Tool } from './tool.interface';
import { FileSystemTools } from './impl/filesystem.tools';

/**
 * The module responsible for all tool-related functionalities.
 * It provides the ToolRegistry service and automatically discovers and
 * registers all methods decorated with @Tool().
 */
@Module({
  imports: [DiscoveryModule],
  providers: [ToolRegistry, FileSystemTools],
  exports: [ToolRegistry],
})
export class ToolsModule implements OnApplicationBootstrap {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly toolRegistry: ToolRegistry,
  ) {}

  /**
   * This lifecycle hook is called once the application has fully started.
   * It uses the DiscoveryService to find all providers, then uses the
   * Reflector to find methods decorated with @Tool() and registers them.
   */
  onApplicationBootstrap() {
    const providers = this.discoveryService.getProviders();

    providers.forEach((wrapper) => {
      const { instance } = wrapper;
      if (!instance || typeof instance !== 'object' || !wrapper.isDependencyTreeStatic()) {
        return;
      }

      const prototype = Object.getPrototypeOf(instance);
      const methodNames = Object.getOwnPropertyNames(prototype);

      methodNames.forEach((methodName) => {
        const method = instance[methodName];
        if (typeof method !== 'function') {
          return;
        }

        const toolDefinition = this.reflector.get<ToolDefinition>(
          TOOL_METADATA_KEY,
          method,
        );

        if (toolDefinition) {
          const tool: Tool = {
            ...toolDefinition,
            execute: method.bind(instance),
          };

          this.toolRegistry.registerTool(tool);
        }
      });
    });
  }
}
