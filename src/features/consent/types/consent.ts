export interface ConsentRecord {
  accepted: boolean;
  version: string;
  acceptedAt: string;
}

export interface ConsentState {
  isAccepted: boolean;
  version: string;
  acceptedAt: string | null;
}

export interface AuthenticatedConsentStatus {
  isAuthenticated: boolean;
  hasAcceptedCurrentVersion: boolean;
  acceptedAt: string | null;
}
