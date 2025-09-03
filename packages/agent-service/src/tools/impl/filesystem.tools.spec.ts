import { Test, TestingModule } from '@nestjs/testing';
import { FileSystemTools } from './filesystem.tools';
import { promises as fs } from 'fs';
import * as path from 'path';

// Mock the 'fs' module
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    // Mock mkdir to return a resolved promise to avoid '.catch is not a function' error
    mkdir: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('FileSystemTools', () => {
  let service: FileSystemTools;
  const workspaceDir = path.resolve(process.cwd(), 'workspace');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileSystemTools],
    }).compile();

    service = module.get<FileSystemTools>(FileSystemTools);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSafePath', () => {
    it('should return a safe path within the workspace', () => {
      const safePath = 'test.txt';
      // This is a private method, so we need to bypass TypeScript's visibility check for testing
      // eslint-disable-next-line @typescript-eslint/dot-notation
      const result = service['getSafePath'](safePath);
      expect(result).toBe(path.join(workspaceDir, safePath));
    });

    it('should throw an error for directory traversal attempts', () => {
      const maliciousPath = '../sensitive-file.txt';
      // eslint-disable-next-line @typescript-eslint/dot-notation
      const action = () => service['getSafePath'](maliciousPath);
      expect(action).toThrow('Path traversal detected. Access is restricted to the workspace directory.');
    });

    it('should throw an error for absolute paths outside the workspace', () => {
      const maliciousPath = '/etc/passwd';
      // eslint-disable-next-line @typescript-eslint/dot-notation
      const action = () => service['getSafePath'](maliciousPath);
      expect(action).toThrow('Path traversal detected. Access is restricted to the workspace directory.');
    });
  });

  describe('readFile', () => {
    it('should call fs.readFile with the correct safe path', async () => {
      const filePath = 'my-file.txt';
      const safePath = path.join(workspaceDir, filePath);
      (fs.readFile as jest.Mock).mockResolvedValue('file content');

      await service.readFile({ path: filePath });
      expect(fs.readFile).toHaveBeenCalledWith(safePath, 'utf-8');
    });
  });

  describe('writeFile', () => {
    it('should call fs.writeFile with the correct safe path and content', async () => {
      const filePath = 'dir/my-new-file.txt';
      const content = 'hello world';
      const safePath = path.join(workspaceDir, filePath);

      await service.writeFile({ path: filePath, content });
      expect(fs.writeFile).toHaveBeenCalledWith(safePath, content, 'utf-8');
      // Also check that it creates the parent directory
      expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(safePath), { recursive: true });
    });
  });
});
