export interface BiometricResponse {
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}