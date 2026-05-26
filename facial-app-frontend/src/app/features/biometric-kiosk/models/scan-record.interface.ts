export interface ScanRecord {
  id: string;
  employeeName: string;
  role: string;
  timestamp: Date;
  status: 'SUCCESS' | 'DENIED';
}
