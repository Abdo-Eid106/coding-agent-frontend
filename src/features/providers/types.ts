export interface AddModelDto {
  id: string;
  displayName: string;
}

export interface AddProviderDto {
  id: string;
  displayName: string;
  baseUrl: string;
  apiKey: string;
  models: AddModelDto[];
}

export interface UpdateProviderDto {
  displayName: string;
  baseUrl: string;
  apiKey: string;
  models: AddModelDto[];
}

export interface AddApiKeyDto {
  apiKey: string;
}

export interface ModelDto {
  id: string;
  displayName: string;
  apiModel?: string;
  contextWindow?: number;
  defaultMaxTokens?: number;
  supportsAttachments?: boolean;
  provider?: string;
}

export interface ProviderDto {
  id: string;
  displayName: string;
  apiKey: string;
  baseUrl: string;
  models: ModelDto[];
}
