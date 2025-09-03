import { Test, TestingModule } from '@nestjs/testing';
import { AgentOrchestratorService } from './agent-orchestrator.service';
import { PlannerService } from './planner.service';
import { ExecutorService } from './executor.service';
import { Plan } from './plan.interface';

const mockPlannerService = {
  createPlan: jest.fn(),
};

const mockExecutorService = {
  executePlan: jest.fn(),
};

describe('AgentOrchestratorService', () => {
  let service: AgentOrchestratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentOrchestratorService,
        { provide: PlannerService, useValue: mockPlannerService },
        { provide: ExecutorService, useValue: mockExecutorService },
      ],
    }).compile();

    service = module.get<AgentOrchestratorService>(AgentOrchestratorService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call planner and then executor to execute a task', async () => {
    const objective = 'test objective';
    const mockPlan: Plan = {
      steps: [{ tool: 'test.tool', inputs: {}, reasoning: 'test' }],
    };
    const mockResults = [{ result: 'success' }];

    mockPlannerService.createPlan.mockResolvedValue(mockPlan);
    mockExecutorService.executePlan.mockResolvedValue(mockResults);

    const finalResult = await service.executeTask(objective);

    // Verify that the planner was called first with the objective
    expect(mockPlannerService.createPlan).toHaveBeenCalledWith(objective);
    // Verify that the executor was called next with the plan from the planner
    expect(mockExecutorService.executePlan).toHaveBeenCalledWith(mockPlan);

    // Verify the final output structure
    expect(finalResult).toEqual({
      objective,
      plan: mockPlan,
      results: mockResults,
    });
  });
});
