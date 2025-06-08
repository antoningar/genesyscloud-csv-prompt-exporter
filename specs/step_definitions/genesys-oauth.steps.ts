import { When } from '@cucumber/cucumber';
import { fakeContext } from './common.steps';

When('context has a clientContext', function () {
  if (!fakeContext.clientContext) {
    fakeContext.clientContext = {};
  }
});

When('clientContext contains a non-empty gc_client_id', function () {
  if (!fakeContext.clientContext) {
    throw new Error('clientContext must be set first');
  }
  fakeContext.clientContext.gc_client_id = 'test-client-id-12345';
});

When('clientContext contains a non-empty gc_client_secret', function () {
  if (!fakeContext.clientContext) {
    throw new Error('clientContext must be set first');
  }
  fakeContext.clientContext.gc_client_secret = 'test-client-secret-67890';
});

When('clientContext contains a non-empty gc_aws_region', function () {
  if (!fakeContext.clientContext) {
    throw new Error('clientContext must be set first');
  }
  fakeContext.clientContext.gc_aws_region = 'us-east-1';
});

