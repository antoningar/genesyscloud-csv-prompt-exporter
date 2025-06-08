import { Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { response } from './common.steps';

Then('the response should contain the expected message', function () {
  const body = JSON.parse(response.body);
  assert.equal(body.message, 'Function executed successfully');
  assert.ok(body.timestamp);
});