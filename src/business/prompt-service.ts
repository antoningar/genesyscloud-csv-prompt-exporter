import { GenesysService } from '../genesys/genesys-service'
import { GenesysOAuthConfig } from './models';

export class PromptService {
  private readonly genesysService: any;

  constructor(genesysService?: any) {
    this.genesysService = genesysService ?? new GenesysService();
  }

  async process(config: GenesysOAuthConfig): Promise<any> {
    await this.genesysService.init(config);

    const prompts = await this.genesysService.process();
    const csvData = this.convertToCsv(prompts);

    return csvData;
  }

  private convertToCsv(prompts: any[]): string {
    if (!prompts || prompts.length === 0) {
      return 'name,description,tts,duration\n';
    }

    const headers = 'name,description,tts,duration\n';
    const rows = prompts.map(prompt => {
      const resources = prompt.resources ?? [];
      if (resources.length === 0) {
        return `${prompt.name},${prompt.description},,`;
      }
      
      return resources.map((resource: any) => 
        `${prompt.name},${prompt.description},${resource.tts},${resource.duration ?? 0}`
      ).join('\n');
    }).join('\n');

    return headers + rows;
  }
}