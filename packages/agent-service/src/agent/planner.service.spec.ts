import { Test, TestingModule } from '@nestjs/testing';
import { PlannerService } from './planner.service';
import { LlmService } from '../llm/llm.service';
import { ToolRegistry } from '../tools/tool.registry';
import { Tool } from '../tools/tool.interface';
import { z } from 'zod';
import { MemoryService } from './memory.service';
import { AgentProfile } from './agent-profile.interface';

const mockLlmService = {
  completion: jest.fn(),
};

const mockToolRegistry = {
  getAllTools: jest.fn(),
};

const mockMemoryService = {
  getHistory: jest.fn(),
};

const mockTool: Tool = {
  name: 'test.tool',
  description: 'A test tool',
  inputSchema: z.object({ param: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async (inputs) => ({ result: `executed with ${inputs.param}` }),
};

const mockProfile: AgentProfile = {
  id: 'test-agent',
  name: 'Test Agent',
  role: 'You are a test agent.',
  goals: ['test'],
};

describe('PlannerService', () => {
  let service: PlannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlannerService,
        { provide: LlmService, useValue: mockLlmService },
        { provide: ToolRegistry, useValue: mockToolRegistry },
        { provide: MemoryService, useValue: mockMemoryService },
      ],
    }).compile();

    service = module.get<PlannerService>(PlannerService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a valid plan from a valid LLM response', async () => {
    const objective = 'test objective';
    const taskId = 'test-task';
    const llmResponse = {
      steps: [{ tool: 'test.tool', inputs: { param: 'value' }, reasoning: 'because' }],
    };
    const llmResponseString = `\`\`\`json\n${JSON.stringify(llmResponse)}\n\`\`\``;

    mockToolRegistry.getAllTools.mockReturnValue([mockTool]);
    mockMemoryService.getHistory.mockReturnValue([]);
    mockLlmService.completion.mockResolvedValue(llmResponseString);

    const plan = await service.createPlan(objective, mockProfile, taskId);

    expect(mockLlmService.completion).toHaveBeenCalledTimes(1);
    expect(plan).toBeDefined();
    expect(plan.steps.length).toBe(1);
    expect(plan.steps[0].tool).toBe('test.tool');
  });

  it('should throw an error for an invalid LLM response', async () => {
    const objective = 'test objective';
    const taskId = 'test-task';
    const invalidLlmResponse = 'this is not json';

    mockToolRegistry.getAllTools.mockReturnValue([mockTool]);
    mockMemoryService.getHistory.mockReturnValue([]);
    mockLlmService.completion.mockResolvedValue(invalidLlmResponse);

    await expect(service.createPlan(objective, mockProfile, taskId)).rejects.toThrow(
      'Could not generate a valid plan.',
    );
  });

  it('should throw an error if the LLM response does not match the schema', async () => {
    const objective = 'test objective';
    const taskId = 'test-task';
    // Response is missing the 'reasoning' field
    const llmResponse = {
      steps: [{ tool: 'test.tool', inputs: { param: 'value' } }],
    };
    const llmResponseString = JSON.stringify(llmResponse);

    mockToolRegistry.getAllTools.mockReturnValue([mockTool]);
    mockMemoryService.getHistory.mockReturnValue([]);
    mockLlmService.completion.mockResolvedValue(llmResponseString);

    await expect(service.createPlan(objective, mockProfile, taskId)).rejects.toThrow(
      'Could not generate a valid plan.',
    );
  });
});
