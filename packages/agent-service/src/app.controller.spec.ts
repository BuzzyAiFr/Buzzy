import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentOrchestratorService } from './agent/agent-orchestrator.service';

describe('AppController', () => {
  let appController: AppController;

  // Create a mock for the AgentOrchestratorService
  const mockAgentOrchestratorService = {
    executeTask: jest.fn().mockResolvedValue({ result: 'task executed' }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        // Provide the mock service
        {
          provide: AgentOrchestratorService,
          useValue: mockAgentOrchestratorService,
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
