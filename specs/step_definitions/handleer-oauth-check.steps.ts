import { Given, When, Then } from '@cucumber/cucumber';
import { handler } from '../../src/handler';
import { strict as assert } from 'assert';

let fakeEvent: any;
let fakeContext: any;
let response: any;

Given('a valid input event', function () {
  fakeEvent = {};
  fakeContext = {
    clientContext: {}
  };
});

Given(/^clientContext gc_client_id is (.*)$/, function (clientId: string) {
  if (clientId && clientId.trim() !== '') {
    fakeContext.clientContext.gc_client_id = clientId;
  }
});

Given(/^clientContext gc_client_secret is (.*)$/, function (clientSecret: string) {
  if (clientSecret && clientSecret.trim() !== '') {
    fakeContext.clientContext.gc_client_secret = clientSecret;
  }
});

Given(/^clientContext gc_aws_region is (.*)$/, function (region: string) {
  if (region && region.trim() !== '') {
    fakeContext.clientContext.gc_aws_region = region;
  }
});

When('calling the function', async function () {
  response = await handler(fakeEvent, fakeContext);
});

Then('it should return a {int} status code', function (expectedStatusCode: number) {
  assert.equal(response.statusCode, expectedStatusCode);
});