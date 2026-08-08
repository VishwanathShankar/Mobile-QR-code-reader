import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset scan state and result', () => {
    component.scanState = 'success';
    component.scanResult = 'https://example.com';
    component.scannedFormat = 'QR_CODE';
    component.statusMessage = 'QR code scanned successfully.';
    component.copyMessage = 'Copied to clipboard.';

    component.resetScan();

    expect(component.scanState).toBe('idle');
    expect(component.scanResult).toBe('');
    expect(component.scannedFormat).toBe('');
    expect(component.statusMessage).toBe('Ready to scan a QR code.');
    expect(component.copyMessage).toBe('');
  });
});
