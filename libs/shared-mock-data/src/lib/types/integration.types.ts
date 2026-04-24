export type IntegrationStatus = 'pending' | 'connected' | 'failed' | 'disconnected';
export type IntegrationProvider = 'SALESFORCE' | 'REDTAIL' | 'WEALTHBOX' | 'ORION' | 'BLACK_DIAMOND';

export interface Integration {
  integrationId: number;
  provider: IntegrationProvider;
  providerDisplayName: string;
  status: IntegrationStatus;
  lastSyncedAt: string | null;
  lastSyncRecordCount: number | null;
  errorMessage: string | null;
  configuredBy: string;
  configuredAt: string;
}

export interface ReconcileRequest {
  integrationId: number;
  forceFullSync?: boolean;
}

export interface ReconcileResponse {
  success: boolean;
  integrationId: number;
  message: string;
  recordsProcessed?: number;
  estimatedCompletionTime?: string;
}
