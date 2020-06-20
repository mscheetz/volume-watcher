import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
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
import { CopyClipboardModule } from './services/copy-clipboard.module';
import { ArbitrageComponent } from './components/arbitrage/arbitrage.component';
import { ArbitrageItemComponent } from './components/arbitrage-item/arbitrage-item.component';
import { ArbitrageItemNodeComponent } from './components/arbitrage-item-node/arbitrage-item-node.component';

const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'voa/:symbol', component: AppComponent },
  { path: 'arbitrage', component: AppComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    VolumesComponent,
    CustomResponseComponent,
    OptionsComponent,
    QrCodesComponent,
    VolumeOverAverageComponent,
    VOAItemComponent,
    ArbitrageComponent,
    ArbitrageItemComponent,
    ArbitrageItemNodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSliderModule,
    MatSnackBarModule,
    QRCodeModule,
    CopyClipboardModule,
    RouterModule.forRoot(appRoutes, { anchorScrolling: 'enabled' })
  ],
  providers: [SocketioService],
  bootstrap: [AppComponent],
  entryComponents: [
    OptionsComponent,
    QrCodesComponent
  ]
})
export class AppModule { }
