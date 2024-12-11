import { Component } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  segment =  'scan';
  scanResult= '';
  constructor(
    private loadingController: LoadingController,
    private platform : Platform,
    private modalController: ModalController



  ) {}

  ngOnInit():void{
    if(this.platform.is('capacitor')){
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
  }

  async starScan() {
    const modal = await this.modalController.create({
    component: BarcodeScanningModalComponent,
    cssClass:'barcode-scannig-modal',
    showBackdrop:false,
    componentProps: { 
      formats:[],
      LensFacing:LensFacing.Back
    }
    });
  
    await modal.present();
    
    const {data} =await modal.onWillDismiss();

    if(data){
      this.scanResult = data?.barcode?.displayValue;
    }



  }


}
