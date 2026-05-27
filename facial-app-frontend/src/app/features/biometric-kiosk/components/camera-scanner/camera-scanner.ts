import { Component, computed, ElementRef, inject, signal, viewChild, OnDestroy } from '@angular/core';
import { PrimaryButton } from '../../../../shared/components/primary-botton/primary-button';
import { KioskService } from '../../services/kiosk.service';
import { EmployeeService } from '../../../employee-management/services/employee.service';

@Component({
  selector: 'app-camera-scanner',
  standalone: true,
  imports: [PrimaryButton],
  templateUrl: './camera-scanner.html',
})
export class CameraScanner implements OnDestroy {

  private kioskService = inject(KioskService);
  private employeeService = inject(EmployeeService);

  // Acceso a los elementos HTML
  cameraVideo = viewChild<ElementRef<HTMLVideoElement>>('cameraVideo');
  photoCanvas = viewChild<ElementRef<HTMLCanvasElement>>('photoCanvas');

  private mediaStream: MediaStream | null = null;
  cameraStatus = signal<'idle' | 'loading' | 'active' | 'verifying' | 'error'>('idle');
  capturedImage = signal<string | null>(null);
  welcomeMessage = signal<string | null>(null);

  buttonLabel = computed(() => {
    const status = this.cameraStatus();
    if (status === 'loading') return 'Iniciando cámara...';
    if (status === 'verifying' || status === 'active') return 'Cancelar / Detener Escaneo';
    return 'Escanee su rostro para marcar entrada';
  })

  
  ngOnDestroy(): void {
    this.stopCamera();
  }

  // Gestor de la camara
  async toggleCamera(): Promise<void> {
    if (this.cameraStatus() === 'active' || this.cameraStatus() === 'verifying') {
      this.stopCamera();
      return;
    }
    // Si la camara esta activada o hay un error (no tiene permisos)
    if (this.cameraStatus() === 'idle' || this.cameraStatus() === 'error') {
      await this.startCamera();
    }
  }

  capturePhoto(): void {

    if (this.cameraStatus() === 'verifying') return;

    const video = this.cameraVideo()?.nativeElement;
    const canvas = this.photoCanvas()?.nativeElement;

    if (!video || !canvas) return;

    if (video.readyState < 2) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL('image/jpeg', 0.8);
    this.capturedImage.set(base64Image);
    this.cameraStatus.set('verifying');

    this.kioskService.verifyBiometrics(base64Image).subscribe({
      next: (response) => {
        const name = response.message ? response.message.split('usuario: ')[1] : 'Empleado';
        this.welcomeMessage.set(`¡Bienvenido, ${name}!`);
        
        this.employeeService.notifyNewScan();
        this.cameraStatus.set('active'); 
        this.capturedImage.set(null);
        setTimeout(() => {
          this.welcomeMessage.set(null);
        }, 3000);
      },
      error: (err) => {
        console.error('Acceso denegado o error de IA:', err);
        alert('Rostro no reconocido. Por favor, registrese en el apartado de "Gestión de empleados" e intentelo de nuevo');
        
        this.cameraStatus.set('active');
        this.capturedImage.set(null); 
      }
    });
  }

  async startCamera(): Promise<void> {
    this.cameraStatus.set('loading');
    try {

      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      const videoElement = this.cameraVideo()?.nativeElement;

      if (videoElement) {
        videoElement.srcObject = this.mediaStream;
        this.cameraStatus.set('active');
      }
    } catch (error) {
      console.error('Error:', error);
      this.cameraStatus.set('error');
      alert('Activar la cámara del navegador.');
    }
  }
  

  private stopCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    const videoElement = this.cameraVideo()?.nativeElement;
    if (videoElement) {
      videoElement.srcObject = null;
    }

    this.cameraStatus.set('idle');
  }
}
