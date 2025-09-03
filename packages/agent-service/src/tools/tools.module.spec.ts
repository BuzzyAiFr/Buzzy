import { Test, TestingModule } from '@nestjs/testing';
import { ToolRegistry } from './tool.registry';
import { ToolsModule } from './tools.module';
import { z } from 'zod';

describe('ToolsModule Integration', () => {
  let moduleFixture: TestingModule;
  let toolRegistry: ToolRegistry;

  beforeAll(async () => {
    // Create a NestJS testing module that imports our ToolsModule.
    moduleFixture = await Test.createTestingModule({
      imports: [ToolsModule],
    }).compile();

    // The .init() method is crucial. It bootstraps the application and
    // triggers the lifecycle hooks like OnApplicationBootstrap. Without this,
    // our discovery logic would never run.
    await moduleFixture.init();

    // Get the instance of the ToolRegistry from the testing module.
    toolRegistry = moduleFixture.get<ToolRegistry>(ToolRegistry);
  });

  afterAll(async () => {
    await moduleFixture.close();
  });

  it('should be defined', () => {
    expect(toolRegistry).toBeDefined();
  });

  it('should discover and register all tools from FileSystemTools', () => {
    const allTools = toolRegistry.getAllTools();
    const toolNames = allTools.map((t) => t.name);

    // Check if the tools from FileSystemTools are registered
    expect(toolNames).toContain('filesystem.readFile');
    expect(toolNames).toContain('filesystem.writeFile');
    expect(toolNames).toContain('filesystem.createDirectory');
    expect(allTools.length).toBeGreaterThanOrEqual(3);
  });

  it('should have correct metadata for a specific tool (filesystem.readFile)', () => {
    const readFileTool = toolRegistry.getTool('filesystem.readFile');

    expect(readFileTool).toBeDefined();
    expect(readFileTool.name).toBe('filesystem.readFile');
    expect(readFileTool.description).toBe(
      'Reads the entire content of a file at the given path. The path must be relative to the workspace.',
    );
    expect(readFileTool.inputSchema).toBeInstanceOf(z.ZodObject);
    expect(readFileTool.outputSchema).toBeInstanceOf(z.ZodObject);
    expect(typeof readFileTool.execute).toBe('function');
  });
});
