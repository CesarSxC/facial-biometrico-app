import { Component } from '@angular/core';
import { CameraScanner } from '../../components/camera-scanner/camera-scanner';
import { RecentScans } from '../../components/recent-scans/recent-scans';

@Component({
  selector: 'app-kiosk-page',
  standalone: true,
  imports: [CameraScanner, RecentScans],
  templateUrl: './kiosk-page.html',
})
export class KioskPage {}
