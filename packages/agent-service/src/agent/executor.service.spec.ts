import { Test, TestingModule } from '@nestjs/testing';
import { ExecutorService } from './executor.service';
import { ToolRegistry } from '../tools/tool.registry';
import { Tool } from '../tools/tool.interface';
import { Plan } from './plan.interface';
import { z } from 'zod';

const mockToolExecute = jest.fn();

const mockTool: Tool = {
  name: 'test.tool',
  description: 'A test tool',
  inputSchema: z.object({ param: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  execute: mockToolExecute,
};

const mockToolRegistry = {
  getTool: jest.fn(),
};

describe('ExecutorService', () => {
  let service: ExecutorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExecutorService,
        { provide: ToolRegistry, useValue: mockToolRegistry },
      ],
    }).compile();

    service = module.get<ExecutorService>(ExecutorService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should execute a valid plan', async () => {
    const plan: Plan = {
      steps: [{ tool: 'test.tool', inputs: { param: 'value' }, reasoning: 'test' }],
    };
    mockToolRegistry.getTool.mockReturnValue(mockTool);
    mockToolExecute.mockResolvedValue({ result: 'success' });

    const results = await service.executePlan(plan);

    expect(mockToolRegistry.getTool).toHaveBeenCalledWith('test.tool');
    expect(mockToolExecute).toHaveBeenCalledWith({ param: 'value' });
    expect(results).toEqual([{ result: 'success' }]);
  });

  it('should throw an error if a tool is not found', async () => {
    const plan: Plan = {
      steps: [{ tool: 'nonexistent.tool', inputs: {}, reasoning: 'test' }],
    };
    mockToolRegistry.getTool.mockReturnValue(undefined);

    await expect(service.executePlan(plan)).rejects.toThrow(
      'Tool not found: nonexistent.tool',
    );
  });

  it('should throw an error if inputs are invalid', async () => {
    const plan: Plan = {
      steps: [{ tool: 'test.tool', inputs: { wrong_param: 123 }, reasoning: 'test' }],
    };
    mockToolRegistry.getTool.mockReturnValue(mockTool);

    // The Zod validation should fail because 'param' is missing and is a string.
    await expect(service.executePlan(plan)).rejects.toThrow();
  });
});
