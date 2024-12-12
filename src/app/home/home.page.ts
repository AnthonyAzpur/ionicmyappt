import { Component } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { PlacaService, PlacaDatos } from '../services/placa.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  placa = ""; // Valor inicial de placa (puede cambiarse)
  placaDatos: PlacaDatos | null = null;
  loading: any;
  noplaca: boolean = false;

  segment = 'scan';
  scanResult = ''; // Esta variable contiene el resultado del escaneo

  constructor(
    private placaService: PlacaService,
    private loadingController: LoadingController,
    private platform: Platform,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    if (this.platform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
  }

  async consultarPlaca() {
    // Crear el spinner de carga
    this.loading = await this.loadingController.create({
      message: 'Consultando placa...',
    });
    await this.loading.present();

    // Llamar al servicio para obtener los datos de la placa
    this.placaService.consultarPlaca(this.placa).subscribe(
      (data) => {
        console.log('Datos recibidos:', data); // Verifica que la respuesta esté correcta

        // Si la respuesta es un array, accedemos al primer objeto
        if (data && data.length > 0) {
          this.placaDatos = data[0];  // Acceder al primer objeto del array
        } else {
          console.error('No se encontraron datos para la placa');
          this.noplaca = true; // Mostrar mensaje si no se encuentra la placa
        }

        this.loading.dismiss(); // Cierra el spinner de carga
      },
      (error) => {
        console.error(error); // Muestra el error en consola
        this.loading.dismiss(); // Cierra el spinner en caso de error
        this.noplaca = true; // Mostrar mensaje si ocurre un error
      }
    );
  }

  async starScan() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scannig-modal',
      showBackdrop: false,
      componentProps: { 
        formats: [],
        LensFacing: LensFacing.Back
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.scanResult = data?.barcode?.displayValue; // Asignar el resultado del escaneo
      this.placa = this.scanResult; // Actualizar la variable placa con el resultado del escaneo

      // Llamar a la función consultarPlaca() después de asignar el valor a placa
      this.consultarPlaca();
    }
  }
}
