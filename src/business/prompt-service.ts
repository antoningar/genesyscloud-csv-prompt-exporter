import { GenesysService } from '../genesys/genesys-service'
import { GenesysOAuthConfig, Prompt } from './models';

export class PromptService {
  private readonly genesysService: GenesysService;

  constructor(genesysService?: GenesysService) {
    this.genesysService = genesysService ?? new GenesysService();
  }

  async process(config: GenesysOAuthConfig): Promise<any> {
    await this.genesysService.init(config);

    const prompts = await this.genesysService.getPrompts();
    const csvData = this.convertToCsv(prompts);

    return csvData;
  }

  private getLanguagesList(prompts: Prompt[]): string[] {
    const allLanguages = new Set<string>();
    prompts.forEach(prompt => {
      prompt.resources?.forEach((resource: any) => {
        if (resource.language) {
          allLanguages.add(resource.language);
        }
      });
    });

    return Array.from(allLanguages).sort((a, b) => a.localeCompare(b));
  }

  private getRows(prompts: Prompt[], languagesList: string[]): string {
    return prompts.map(prompt => {
      const resourcesByLanguage = new Map<string, any>();
      prompt.resources?.forEach((resource: any) => {
        if (resource.language) {
          resourcesByLanguage.set(resource.language, resource);
        }
      });

      const row = [
        `"${prompt.name}"`,
        `"${prompt.description}"`,
        ...languagesList.map(lang => {
          const resource = resourcesByLanguage.get(lang);
          return `"${resource ? resource.tts : ''}"`;
        })
      ];

      return row.join(',');
    }).join('\n');    
  }

  private convertToCsv(prompts: Prompt[]): string {
    if (!prompts || prompts.length === 0) {
      return '"name","description"\n';
    }

    const languagesList = this.getLanguagesList(prompts);
    const headers = ['"name"', '"description"', ...languagesList.map(lang => `"${lang}"`)].join(',') + '\n';    
    const rows = this.getRows(prompts, languagesList);

    return headers + rows;
  }
}