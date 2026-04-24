import { Integration, ReconcileRequest, ReconcileResponse } from '../types';

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    integrationId: 1,
    provider: 'SALESFORCE',
    providerDisplayName: 'Salesforce CRM',
    status: 'connected',
    lastSyncedAt: '2024-01-18T08:00:00Z',
    lastSyncRecordCount: 1542,
    errorMessage: null,
    configuredBy: 'admin@wealthplatform.com',
    configuredAt: '2023-06-15T10:30:00Z',
  },
  {
    integrationId: 2,
    provider: 'REDTAIL',
    providerDisplayName: 'Redtail CRM',
    status: 'connected',
    lastSyncedAt: '2024-01-18T07:45:00Z',
    lastSyncRecordCount: 823,
    errorMessage: null,
    configuredBy: 'admin@wealthplatform.com',
    configuredAt: '2023-08-20T14:15:00Z',
  },
  {
    integrationId: 3,
    provider: 'WEALTHBOX',
    providerDisplayName: 'Wealthbox CRM',
    status: 'failed',
    lastSyncedAt: '2024-01-17T12:00:00Z',
    lastSyncRecordCount: 0,
    errorMessage: 'Authentication token expired. Please reconnect.',
    configuredBy: 'ops@wealthplatform.com',
    configuredAt: '2023-09-05T09:00:00Z',
  },
  {
    integrationId: 4,
    provider: 'ORION',
    providerDisplayName: 'Orion Portfolio Solutions',
    status: 'pending',
    lastSyncedAt: null,
    lastSyncRecordCount: null,
    errorMessage: null,
    configuredBy: 'tech@wealthplatform.com',
    configuredAt: '2024-01-15T16:30:00Z',
  },
  {
    integrationId: 5,
    provider: 'BLACK_DIAMOND',
    providerDisplayName: 'Black Diamond Wealth Platform',
    status: 'disconnected',
    lastSyncedAt: '2023-12-01T10:00:00Z',
    lastSyncRecordCount: 2156,
    errorMessage: 'Integration manually disconnected by administrator.',
    configuredBy: 'admin@wealthplatform.com',
    configuredAt: '2023-04-10T11:45:00Z',
  },
];

export function getAllIntegrations(): Integration[] {
  return [...MOCK_INTEGRATIONS];
}

export function getIntegrationById(integrationId: number): Integration | undefined {
  return MOCK_INTEGRATIONS.find(i => i.integrationId === integrationId);
}

export function getIntegrationsByStatus(status: Integration['status']): Integration[] {
  return MOCK_INTEGRATIONS.filter(i => i.status === status);
}

export function reconcileIntegration(request: ReconcileRequest): ReconcileResponse {
  const integration = getIntegrationById(request.integrationId);
  
  if (!integration) {
    return {
      success: false,
      integrationId: request.integrationId,
      message: 'Integration not found',
    };
  }

  if (integration.status === 'disconnected') {
    return {
      success: false,
      integrationId: request.integrationId,
      message: 'Cannot reconcile a disconnected integration. Please reconnect first.',
    };
  }

  const randomSuccess = Math.random() > 0.15;

  if (!randomSuccess) {
    return {
      success: false,
      integrationId: request.integrationId,
      message: 'Reconciliation failed: Connection timeout. Please try again.',
    };
  }

  const recordsProcessed = Math.floor(Math.random() * 500) + 100;
  const estimatedTime = new Date();
  estimatedTime.setMinutes(estimatedTime.getMinutes() + Math.floor(Math.random() * 10) + 2);

  const index = MOCK_INTEGRATIONS.findIndex(i => i.integrationId === request.integrationId);
  if (index !== -1) {
    MOCK_INTEGRATIONS[index] = {
      ...MOCK_INTEGRATIONS[index],
      status: 'connected',
      lastSyncedAt: new Date().toISOString(),
      lastSyncRecordCount: recordsProcessed,
      errorMessage: null,
    };
  }

  return {
    success: true,
    integrationId: request.integrationId,
    message: 'Reconciliation started successfully',
    recordsProcessed,
    estimatedCompletionTime: estimatedTime.toISOString(),
  };
}
