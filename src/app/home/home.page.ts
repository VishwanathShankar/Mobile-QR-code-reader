import { Component } from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonNote,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerAndroidScanningLibrary,
  CapacitorBarcodeScannerCameraDirection,
  CapacitorBarcodeScannerScanOrientation,
  CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  copyOutline,
  qrCodeOutline,
  refreshOutline,
  scanOutline,
} from 'ionicons/icons';

type ScanState = 'idle' | 'scanning' | 'success' | 'error';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonNote,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class HomePage {
  scanState: ScanState = 'idle';
  scanResult = '';
  scannedFormat = '';
  statusMessage = 'Ready to scan a QR code.';
  copyMessage = '';

  constructor() {
    addIcons({
      alertCircleOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      copyOutline,
      qrCodeOutline,
      refreshOutline,
      scanOutline,
    });
  }

  get isScanning(): boolean {
    return this.scanState === 'scanning';
  }

  async scanQrCode(): Promise<void> {
    if (this.isScanning) {
      return;
    }

    this.scanState = 'scanning';
    this.copyMessage = '';
    this.statusMessage = 'Opening camera...';

    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
        scanInstructions: 'Place the QR code inside the scanner frame.',
        cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
        scanOrientation: CapacitorBarcodeScannerScanOrientation.ADAPTIVE,
        cancelButtonAccessibilityLabel: 'Cancel QR code scan',
        torchButtonOnAccessibilityLabel: 'Turn flashlight off',
        torchButtonOffAccessibilityLabel: 'Turn flashlight on',
        android: {
          scanningLibrary: CapacitorBarcodeScannerAndroidScanningLibrary.ZXING,
        },
        web: {
          showCameraSelection: true,
          scannerFPS: 12,
        },
      });

      const scannedText = result.ScanResult.trim();
      if (!scannedText) {
        this.scanState = 'error';
        this.statusMessage = 'The scanner finished without reading any QR content.';
        return;
      }

      this.scanResult = scannedText;
      this.scannedFormat = this.formatName(result.format);
      this.scanState = 'success';
      this.statusMessage = 'QR code scanned successfully.';
    } catch (error) {
      this.scanState = 'error';
      this.statusMessage = this.describeScanError(error);
    }
  }

  async copyResult(): Promise<void> {
    if (!this.scanResult) {
      return;
    }

    try {
      await this.copyText(this.scanResult);
      this.copyMessage = 'Copied to clipboard.';
    } catch {
      this.copyMessage = 'Could not copy automatically. Press and hold the result to copy it.';
    }
  }

  resetScan(): void {
    this.scanState = 'idle';
    this.scanResult = '';
    this.scannedFormat = '';
    this.statusMessage = 'Ready to scan a QR code.';
    this.copyMessage = '';
  }

  private async copyText(text: string): Promise<void> {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();

    const copied = document.execCommand('copy');
    textArea.remove();

    if (!copied) {
      throw new Error('Clipboard copy failed.');
    }
  }

  private formatName(format: number): string {
    return CapacitorBarcodeScannerTypeHint[format] ?? `Format ${format}`;
  }

  private describeScanError(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);

    if (message.toLowerCase().includes('cancel')) {
      return 'Scan cancelled.';
    }

    if (message.toLowerCase().includes('permission')) {
      return 'Camera permission is required to scan QR codes.';
    }

    if (message.toLowerCase().includes('notallowed')) {
      return 'Camera access was blocked. Allow camera access and try again.';
    }

    return message || 'Something went wrong while scanning.';
  }
}
