import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PromptService } from '../business/prompt-service';

function validateOAuthCredentials(context: any): boolean {
  if (!context?.clientContext) {
    return false;
  }

  const { gc_client_id, gc_client_secret, gc_aws_region } = context.clientContext;

  return !!(gc_client_id && gc_client_id.trim() !== '' &&
           gc_client_secret && gc_client_secret.trim() !== '' &&
           gc_aws_region && gc_aws_region.trim() !== '');
}

export const handler = async (
  event: any,
  context: any
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Event:', JSON.stringify(event, null, 2));
    console.log('Context:', JSON.stringify(context, null, 2));

    if (!validateOAuthCredentials(context)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Unauthorized: Invalid or missing OAuth credentials',
          error: 'Missing required OAuth parameters: gc_client_id, gc_client_secret, gc_aws_region',
        }),
      };
    }

    const promptService = new PromptService();
    const result = await promptService.process(context.clientContext);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Function executed successfully',
        result: result,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

// CLI runner
if (require.main === module) {
  const fakeEvent: APIGatewayProxyEvent = {
    body: process.argv[2] || '{"test": "data"}',
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'POST',
    isBase64Encoded: false,
    path: '/test',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {} as any,
    resource: '/test'
  };

  const fakeContext: any = {
    clientContext: {
      gc_client_id: 'test-client-id',
      gc_client_secret: 'test-client-secret',
      gc_aws_region: 'us-east-1'
    }
  };

  handler(fakeEvent, fakeContext)
    .then(result => {
      console.log('Result:', JSON.stringify(result, null, 2));
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}