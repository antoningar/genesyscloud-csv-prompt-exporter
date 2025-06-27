import { Given, When, Then } from '@cucumber/cucumber';
import { PromptService } from '../../src/business/prompt-service';
import { strict as assert } from 'assert';

let mockGenesysService: any;
let promptService: PromptService;
let result: any;

Given('Some existing prompts', function () {
  mockGenesysService = {
    init: async () => Promise.resolve(),
    getPrompts: async () => Promise.resolve([
      {
        name: 'Welcome Prompt',
        description: 'Welcome message for customers',
        resources: [
          { tts: 'Welcome to our service', duration: 0, language: "en-us" }
        ]
      },
      {
        name: 'Hold Music',
        description: 'Music played while on hold',
        resources: [
          { tts: '', duration: 10, language: "fr-fr" }
        ]
      }
    ])
  };
});

When('Processing the prompt service', async function () {
  promptService = new PromptService(mockGenesysService);
  
  const mockConfig = {
    gc_client_id: 'test-client-id',
    gc_client_secret: 'test-client-secret',
    gc_aws_region: 'us-east-1'
  };
  
  result = await promptService.process(mockConfig);
});

Then('Prompts should be returns as a csv string', function () {
  assert(result, 'Result should exist');
  assert(typeof result === 'string', 'Result data should be a CSV string');
  
  const csvData = result;
  console.log(csvData)
  assert(csvData.includes('"name","description","en-us","fr-fr"'), 'CSV should have correct headers');
  assert(csvData.includes('Welcome Prompt'), 'CSV should contain first prompt name');
  assert(csvData.includes('Hold Music'), 'CSV should contain second prompt name');
  assert(csvData.includes('Welcome to our service'), 'CSV should contain TTS content');
});