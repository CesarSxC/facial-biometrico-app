import { BiometricResponse } from '../models/biometric-response.interface';
import { ScanRecord } from '../models/scan-record.interface';

export function adaptBiometricResponse(response: BiometricResponse): ScanRecord {
  const extractedName = response.message ? response.message.split('usuario: ')[1] : 'Empleado';
  
  return {
    id: crypto.randomUUID(),
    employeeName: extractedName, 
    role: 'Acceso Autorizado',
    status: 'SUCCESS',
    timestamp: new Date(),
  };
}
