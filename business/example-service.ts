export class ExampleService {
  async process(data: any): Promise<any> {
    // Business logic implementation goes here
    return {
      processed: true,
      data: data,
      timestamp: new Date().toISOString()
    };
  }
}