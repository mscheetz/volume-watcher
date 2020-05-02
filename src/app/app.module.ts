import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { QRCodeModule } from 'angularx-qrcode';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VolumesComponent } from './components/volumes/volumes.component';
import { SocketioService } from './services/socket.service';
import { CustomResponseComponent } from './components/custom-response/custom-response.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OptionsComponent } from './components/options/options.component';
import { QrCodesComponent } from './components/qr-codes/qr-codes.component';
import { VolumeOverAverageComponent } from './components/volume-over-average/volume-over-average.component';
import { VOAItemComponent } from './components/v-o-a-item/v-o-a-item.component';

@NgModule({
  declarations: [
    AppComponent,
    VolumesComponent,
    CustomResponseComponent,
    OptionsComponent,
    QrCodesComponent,
    VolumeOverAverageComponent,
    VOAItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSliderModule,
    MatSnackBarModule,
    QRCodeModule
  ],
  providers: [SocketioService],
  bootstrap: [AppComponent],
  entryComponents: [
    OptionsComponent,
    QrCodesComponent
  ]
})
export class AppModule { }
