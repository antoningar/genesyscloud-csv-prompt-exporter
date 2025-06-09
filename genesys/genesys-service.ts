import { ApiClientClass, ApiClient, PureCloudRegionHosts, ArchitectApi } from 'purecloud-platform-client-v2';
import { GenesysOAuthConfig, Prompt } from '../business/models';

export class GenesysService {
  client: ApiClientClass = ApiClient.instance;
  api: ArchitectApi = new ArchitectApi();

  constructor() {
    this.setLogger();
  }
  
  async init(oauthConfig: GenesysOAuthConfig) {
    this.client.setEnvironment(PureCloudRegionHosts[oauthConfig.gc_aws_region]);
    await this.client.loginClientCredentialsGrant(oauthConfig.gc_client_id, oauthConfig.gc_client_secret);
  }

  async process(): Promise<any> {
    return await this.getPrompts();
  }

  async getPrompts(): Promise<Prompt[]> {
    const allPrompts: Prompt[] = [];
    let pageNumber = 1;
    const pageSize = 100;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await this.api.getArchitectPrompts({
        pageSize: pageSize,
        pageNumber: pageNumber
      });

      if (response.entities) {
        const convertedPrompts = response.entities.map(prompt => ({
          name: prompt.name || '',
          description: prompt.description || '',
          resources: prompt.resources?.map(resource => ({
            tts: resource.ttsString || '',
            duration: resource.durationSeconds || 0
          })) || []
        }));
        
        allPrompts.push(...convertedPrompts);
      }

      hasNextPage = response.nextUri !== null && response.nextUri !== undefined;
      pageNumber++;
    }

    return allPrompts;
  }

  setLogger() {
    this.client.config.logger.log_level =
      this.client.config.logger.logLevelEnum.level.LTrace;
    this.client.config.logger.log_format =
      this.client.config.logger.logFormatEnum.formats.LTrace;
    this.client.config.logger.log_request_body = true;
    this.client.config.logger.log_response_body = true;
    this.client.config.logger.log_to_console = true;

    this.client.config.logger.setLogger();
  }
}