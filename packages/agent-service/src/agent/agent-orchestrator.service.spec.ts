import { Test, TestingModule } from '@nestjs/testing';
import { AgentOrchestratorService } from './agent-orchestrator.service';
import { PlannerService } from './planner.service';
import { ExecutorService } from './executor.service';
import { Plan } from './plan.interface';
import { AgentProfileRepository } from './agent-profile.repository';
import { MemoryService } from './memory.service';
import { AgentProfile } from './agent-profile.interface';

const mockPlannerService = {
  createPlan: jest.fn(),
};

const mockExecutorService = {
  executePlan: jest.fn(),
};

const mockProfileRepo = {
  findById: jest.fn(),
};

const mockMemoryService = {
  startSession: jest.fn(),
  addMessage: jest.fn(),
};

const mockProfile: AgentProfile = {
  id: 'test-agent',
  name: 'Test Agent',
  role: 'You are a test agent.',
  goals: ['test'],
};

describe('AgentOrchestratorService', () => {
  let service: AgentOrchestratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentOrchestratorService,
        { provide: PlannerService, useValue: mockPlannerService },
        { provide: ExecutorService, useValue: mockExecutorService },
        { provide: AgentProfileRepository, useValue: mockProfileRepo },
        { provide: MemoryService, useValue: mockMemoryService },
      ],
    }).compile();

    service = module.get<AgentOrchestratorService>(AgentOrchestratorService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call all services in order to execute a task', async () => {
    const objective = 'test objective';
    const agentId = 'test-agent';
    const mockPlan: Plan = {
      steps: [{ tool: 'test.tool', inputs: {}, reasoning: 'test' }],
    };
    const mockResults = [{ result: 'success' }];

    // Setup mocks
    mockProfileRepo.findById.mockReturnValue(mockProfile);
    mockPlannerService.createPlan.mockResolvedValue(mockPlan);
    mockExecutorService.executePlan.mockResolvedValue(mockResults);

    const finalResult = await service.executeTask(objective, agentId);

    // Verify calls
    expect(mockMemoryService.startSession).toHaveBeenCalledTimes(1);
    expect(mockProfileRepo.findById).toHaveBeenCalledWith(agentId);
    expect(mockPlannerService.createPlan).toHaveBeenCalledWith(
      objective,
      mockProfile,
      expect.any(String), // taskId
    );
    expect(mockExecutorService.executePlan).toHaveBeenCalledWith(mockPlan);
    // Verify that messages were added to memory
    expect(mockMemoryService.addMessage).toHaveBeenCalledTimes(3);

    // Verify the final output structure
    expect(finalResult).toHaveProperty('taskId');
    expect(finalResult.agentProfile).toEqual(mockProfile);
    expect(finalResult.plan).toEqual(mockPlan);
    expect(finalResult.results).toEqual(mockResults);
  });
});
