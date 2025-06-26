// Transfer step constants
export const TRANSFER_STEPS = {
  FORM: 1,
  CONFIRM: 2,
  OTP: 3,
  COMPLETE: 4,
};

// Fee types
export const FEE_TYPES = {
  SENDER: 'SENDER',
  RECEIVER: 'RECEIVER',
};

// Transfer types
export const TRANSFER_TYPES = {
  INTERNAL: 'internal',
  EXTERNAL: 'external',
};

// Status colors
export const STATUS_COLORS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Default form state
export const DEFAULT_TRANSFER_FORM = {
  accountNumberReceiver: '',
  amount: '',
  message: '',
  feeType: FEE_TYPES.SENDER,
  transferType: TRANSFER_TYPES.INTERNAL,
  sourceAccountNumber: '',
  bankId: '',
  recipientName: '',
};

// Default recipient form
export const DEFAULT_RECIPIENT_FORM = {
  accountNumber: '',
  bankName: '',
  recipientName: '',
  recipientNickname: '',
};
