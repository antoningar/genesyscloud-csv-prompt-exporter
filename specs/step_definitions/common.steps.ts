import { Given, When, Then } from '@cucumber/cucumber';
import { handler } from '../../src/handler';
import { strict as assert } from 'assert';

let fakeEvent: any;
export let fakeContext: any;
export let response: any;

Given('a valid input event', function () {
  fakeEvent = {};

  fakeContext = {
    clientContext: {
      gc_client_id: 'test-client-id',
      gc_client_secret: 'test-client-secret',
      gc_aws_region: 'us-east-1'
    }
  };
});

When('the lambda function is invoked', async function () {
  response = await handler(fakeEvent, fakeContext);
});

Then('it should return a successful response', function () {
  assert.equal(response.statusCode, 200);
});