export interface GenesysOAuthConfig {
  gc_client_id: string;
  gc_client_secret: string;
  gc_aws_region: string;
}

export interface Prompt {
  name: string;
  description: string;
  resources: PromptResources[];
}

export interface PromptResources {
  tts: string;
  duration: number;
  language: string;
}