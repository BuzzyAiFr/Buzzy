import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentOrchestratorService } from './agent/agent-orchestrator.service';
import { AgentProfileRepository } from './agent/agent-profile.repository';

describe('AppController', () => {
  let appController: AppController;

  // Create a mock for the AgentOrchestratorService
  const mockAgentOrchestratorService = {
    executeTask: jest.fn().mockResolvedValue({ result: 'task executed' }),
  };

  const mockProfileRepo = {
    findAll: jest.fn().mockReturnValue([{ id: 'default-id' }]),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AgentOrchestratorService,
          useValue: mockAgentOrchestratorService,
        },
        {
          provide: AgentProfileRepository,
          useValue: mockProfileRepo,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
