export interface ConsentRecord {
  accepted: boolean;
  version: string;
  acceptedAt: string;
}

export interface ConsentState {
  isAccepted: boolean;
  version: string;
}
