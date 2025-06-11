import { Given, When, Then } from '@cucumber/cucumber';
import { PromptService } from '../../business/prompt-service';
import { strict as assert } from 'assert';

let mockGenesysService: any;
let promptService: PromptService;
let result: any;

Given('Some existing prompts', function () {
  mockGenesysService = {
    init: async () => Promise.resolve(),
    process: async () => Promise.resolve([
      {
        name: 'Welcome Prompt',
        description: 'Welcome message for customers',
        resources: [
          { tts: 'Welcome to our service', duration: 5 }
        ]
      },
      {
        name: 'Hold Music',
        description: 'Music played while on hold',
        resources: [
          { tts: 'Please hold while we connect you', duration: 10 }
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
  assert(result.processed === true, 'Result should be processed');
  assert(typeof result.data === 'string', 'Result data should be a CSV string');
  
  const csvData = result.data;
  assert(csvData.includes('name,description,tts,duration'), 'CSV should have correct headers');
  assert(csvData.includes('Welcome Prompt'), 'CSV should contain first prompt name');
  assert(csvData.includes('Hold Music'), 'CSV should contain second prompt name');
  assert(csvData.includes('Welcome to our service'), 'CSV should contain TTS content');
});