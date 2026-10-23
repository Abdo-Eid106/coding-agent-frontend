export interface AddCustomModel {
  modelId: string;
  displayName: string;
}

export interface AddCustomProviderDto {
  providerId: string;
  displayName: string;
  baseUrl: string;
  apiKey: string;
  models: AddCustomModel[];
}

export interface AddApiKeyDto {
  apiKey: string;
}

export interface ModelDto {
  id: string;
  name: string;
  apiModel: string;
  contextWindow: number;
  defaultMaxTokens: number;
  supportsAttachments: boolean;
  provider: string;
}

export interface ProviderDto {
  id: string;
  name: string;
  apiKey: string | null;
  baseUrl: string | null;
  models: ModelDto[];
}
