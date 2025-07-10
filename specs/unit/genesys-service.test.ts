import { GenesysService } from '../../src/genesys/genesys-service';
import { Prompt } from '../../src/business/models';

jest.mock('purecloud-platform-client-v2', () => ({
  ApiClient: {
    instance: {
      setEnvironment: jest.fn(),
      loginClientCredentialsGrant: jest.fn(),
      config: {
        logger: {
          log_level: '',
          logLevelEnum: { level: { LTrace: 'LTrace' } },
          log_format: '',
          logFormatEnum: { formats: { LTrace: 'LTrace' } },
          log_request_body: false,
          log_response_body: false,
          log_to_console: false,
          setLogger: jest.fn()
        }
      }
    }
  },
  PureCloudRegionHosts: {},
  ArchitectApi: jest.fn().mockImplementation(() => ({
    getArchitectPrompts: jest.fn()
  }))
}));

describe('GenesysService', () => {
  let service: GenesysService;
  let mockArchitectApi: any;

  beforeEach(() => {
    service = new GenesysService();
    mockArchitectApi = service.api;
  });

  describe('getPrompts', () => {
    it('should return prompts sorted alphabetically by name', async () => {
      const mockPrompts = [
        { name: 'Zebra Prompt', description: 'Z description', resources: [] },
        { name: 'Alpha Prompt', description: 'A description', resources: [] },
        { name: 'Beta Prompt', description: 'B description', resources: [] }
      ];

      mockArchitectApi.getArchitectPrompts.mockResolvedValue({
        entities: mockPrompts,
        nextUri: null
      });

      const result = await service.getPrompts();

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Alpha Prompt');
      expect(result[1].name).toBe('Beta Prompt');
      expect(result[2].name).toBe('Zebra Prompt');
    });

    it('should handle empty prompts list', async () => {
      mockArchitectApi.getArchitectPrompts.mockResolvedValue({
        entities: [],
        nextUri: null
      });

      const result = await service.getPrompts();

      expect(result).toHaveLength(0);
    });

    it('should sort prompts case-insensitively', async () => {
      const mockPrompts = [
        { name: 'zebra prompt', description: 'Z description', resources: [] },
        { name: 'Alpha Prompt', description: 'A description', resources: [] },
        { name: 'beta prompt', description: 'B description', resources: [] }
      ];

      mockArchitectApi.getArchitectPrompts.mockResolvedValue({
        entities: mockPrompts,
        nextUri: null
      });

      const result = await service.getPrompts();

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Alpha Prompt');
      expect(result[1].name).toBe('beta prompt');
      expect(result[2].name).toBe('zebra prompt');
    });
  });
});