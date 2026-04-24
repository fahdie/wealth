import { Transfer, TransferRequest, TransferResponse } from '../types';

export const MOCK_TRANSFERS: Transfer[] = [
  {
    transferId: 'TRF-001',
    fromAccountNumber: 78432156,
    toAccountNumber: 78432157,
    amount: 5000.00,
    currency: 'USD',
    type: 'INTERNAL',
    status: 'COMPLETED',
    initiatedBy: 'mchen',
    initiatedAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T10:30:05Z',
    failureReason: null,
    memo: 'IRA contribution',
  },
  {
    transferId: 'TRF-002',
    fromAccountNumber: 89123457,
    toAccountNumber: 89123456,
    amount: 2500.00,
    currency: 'USD',
    type: 'INTERNAL',
    status: 'COMPLETED',
    initiatedBy: 'sjohnson',
    initiatedAt: '2024-01-14T14:15:00Z',
    completedAt: '2024-01-14T14:15:03Z',
    failureReason: null,
    memo: 'Roth contribution',
  },
  {
    transferId: 'TRF-003',
    fromAccountNumber: 91234567,
    toAccountNumber: 92345678,
    amount: 10000.00,
    currency: 'USD',
    type: 'WIRE',
    status: 'PROCESSING',
    initiatedBy: 'rwilliams',
    initiatedAt: '2024-01-18T09:00:00Z',
    completedAt: null,
    failureReason: null,
    memo: 'Trust distribution',
  },
  {
    transferId: 'TRF-004',
    fromAccountNumber: 78432156,
    toAccountNumber: 89123457,
    amount: 15000.00,
    currency: 'USD',
    type: 'ACH',
    status: 'PENDING',
    initiatedBy: 'mchen',
    initiatedAt: '2024-01-18T11:45:00Z',
    completedAt: null,
    failureReason: null,
    memo: null,
  },
  {
    transferId: 'TRF-005',
    fromAccountNumber: 92345678,
    toAccountNumber: 78432156,
    amount: 7500.00,
    currency: 'USD',
    type: 'INTERNAL',
    status: 'FAILED',
    initiatedBy: 'edavis',
    initiatedAt: '2024-01-12T16:20:00Z',
    completedAt: null,
    failureReason: 'Insufficient funds in source account',
    memo: 'Investment rebalance',
  },
];

let transferIdCounter = 6;

export function createMockTransfer(request: TransferRequest): TransferResponse {
  const randomSuccess = Math.random() > 0.1;
  
  if (!randomSuccess) {
    return {
      success: false,
      message: 'Transfer failed: Unable to process at this time. Please try again.',
    };
  }

  const newTransferId = `TRF-${String(transferIdCounter++).padStart(3, '0')}`;
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 1);

  const newTransfer: Transfer = {
    transferId: newTransferId,
    fromAccountNumber: request.fromAccountNumber,
    toAccountNumber: request.toAccountNumber,
    amount: request.amount,
    currency: request.currency,
    type: 'INTERNAL',
    status: 'PENDING',
    initiatedBy: 'current-user',
    initiatedAt: new Date().toISOString(),
    completedAt: null,
    failureReason: null,
    memo: request.memo || null,
  };

  MOCK_TRANSFERS.push(newTransfer);

  return {
    success: true,
    transferId: newTransferId,
    status: 'PENDING',
    message: 'Transfer initiated successfully',
    estimatedCompletionDate: estimatedDate.toISOString().split('T')[0],
  };
}

export function getTransfersByAccount(accountNumber: number): Transfer[] {
  return MOCK_TRANSFERS.filter(
    t => t.fromAccountNumber === accountNumber || t.toAccountNumber === accountNumber
  );
}

export function getTransferById(transferId: string): Transfer | undefined {
  return MOCK_TRANSFERS.find(t => t.transferId === transferId);
}

export function getAllTransfers(): Transfer[] {
  return [...MOCK_TRANSFERS];
}
