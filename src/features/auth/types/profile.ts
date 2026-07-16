export interface ProfileRecord {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthFormState {
  email: string;
  password: string;
  displayName?: string;
}
