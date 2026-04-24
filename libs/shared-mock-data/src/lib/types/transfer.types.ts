export type TransferStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type TransferType = 'INTERNAL' | 'ACH' | 'WIRE';

export interface Transfer {
  transferId: string;
  fromAccountNumber: number;
  toAccountNumber: number;
  amount: number;
  currency: string;
  type: TransferType;
  status: TransferStatus;
  initiatedBy: string;
  initiatedAt: string;
  completedAt: string | null;
  failureReason: string | null;
  memo: string | null;
}

export interface TransferRequest {
  fromAccountNumber: number;
  toAccountNumber: number;
  amount: number;
  currency: string;
  memo?: string;
}

export interface TransferResponse {
  success: boolean;
  transferId?: string;
  status?: TransferStatus;
  message: string;
  estimatedCompletionDate?: string;
}
