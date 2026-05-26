import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { ScanRecord } from '../models/scan-record.interface';
import { BiometricResponse } from '../models/biometric-response.interface';
import { environment } from '../../../../environments/enviroment';
import { adaptBiometricResponse } from '../adapters/biometric.adapter';

@Injectable({
  providedIn: 'root'
})
export class KioskService {
  private readonly RECOGNIZE_URL = `${environment.apiUrl}/attendance/recognize`;

  //Dependencia HttpClient para solicitudes HTTP 
  private http = inject(HttpClient);

  // Signal para los Scaneos 
  private readonly recentScansState = signal<ScanRecord[]>([]);
  recentScans = this.recentScansState.asReadonly();

  verifyBiometrics(base64Image: string): Observable<BiometricResponse> {
    // Recibimos el base64 de la imagen y usamos la funcion privada
    const imageBlob = this.base64ToBlob(base64Image);
    const formData = new FormData();
    formData.append('file', imageBlob, `scan_${Date.now()}.jpg`);
    
    return this.http.post<BiometricResponse>(this.RECOGNIZE_URL, formData).pipe(
      //Usamos el tap para verificar el estado
      tap((response) => {
        if (response.status === 'success') {
          //usamos el adaptador para crear el contenido a base de la response
          const newScan = adaptBiometricResponse(response)  
          //Actualizamos la signal con el contenido modificado.
          this.recentScansState.update(scans => [newScan, ...scans]);
        }
      })
    );
  }

  private base64ToBlob(base64: string, mimeType: string = 'image/jpeg'): Blob {
    // Convertimos el texto de la imagen (base64) a binario
    const byteString = atob(base64.split(',')[1]);
    // Reservamos un espacio en memoria binaria segun la longitud del binario
    const arrayBuffer = new ArrayBuffer(byteString.length);
    // Ahora podemos usar el buffer de forma de array
    const int8Array = new Uint8Array(arrayBuffer);
    // Ingresamos los datos del byteString convertidos a binario al array (int8Array)
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    // Convertimos el array en un archivo blob, con su tipo del archivo (imagen)
    return new Blob([arrayBuffer], { type: mimeType });
  }
}