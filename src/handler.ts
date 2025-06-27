import { APIGatewayProxyEvent } from 'aws-lambda';
import { PromptService } from './business/prompt-service';

interface Context {
  clientContext: ClientContext
};

interface ClientContext {
  gc_client_id: string
  gc_client_secret: string
  gc_aws_region: string
};

function validateOAuthCredentials(context: Context): boolean {
  if (!context?.clientContext) {
    return false;
  }

  const { gc_client_id, gc_client_secret, gc_aws_region } = context.clientContext;

  return !!(gc_client_id && gc_client_id.trim() !== '' &&
           gc_client_secret && gc_client_secret.trim() !== '' &&
           gc_aws_region && gc_aws_region.trim() !== '');
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
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
      body: result,
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
    body: process.argv[2] ?? '{"test": "data"}',
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
      gc_client_id: 'f2364d1d-cfa0-4445-b237-8e0f48904178',
      gc_client_secret: '-cPKFl5zoUI_4OGCm63LLNvegUooQr7cYFZ0x7eLdqI',
      gc_aws_region: 'eu_west_1'
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