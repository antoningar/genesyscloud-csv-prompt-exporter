import { GenesysService } from '../genesys/genesys-service'
import { GenesysOAuthConfig } from '../business/models';

export class PromptService {
  private genesysService: any;

  constructor(genesysService?: any) {
    this.genesysService = genesysService || new GenesysService();
  }

  async process(config: GenesysOAuthConfig): Promise<any> {
    await this.genesysService.init(config);

    return {
      processed: true,
      data: await this.genesysService.process(),
      timestamp: new Date().toISOString()
    };
  }
}