export interface ModelDto {
  id: string;
  displayName: string;
  provider?: string;
}

export interface ProviderDto {
  id: string;
  displayName: string;
  apiKey: string;
  baseUrl: string;
  models: ModelDto[];
}

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

export interface ModelDto {
  id: string;
  displayName: string;
  provider?: string;
}

export interface ProviderDto {
  id: string;
  displayName: string;
  apiKey: string;
  baseUrl: string;
  models: ModelDto[];
}
