import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-qr-codes',
  templateUrl: './qr-codes.component.html',
  styleUrls: ['./qr-codes.component.css']
})
export class QrCodesComponent implements OnInit {
  coins: string[] = [ 'BTC', 'ETH', 'NANO', 'RVN' ];
  selectedCoin: string = "";
  btc: string;
  eth: string;
  nano: string;
  rvn: string;
  btcColors: string[] = ['#f7931a', '#ffffff' ]; // [ '#4d4d4d', '#f7931a' ];
  ethColors: string[] = [ '#454A75', '#ffffff' ];
  nanoColors: string[] = [ '#000233', '#ffffff' ];
  rvnColors: string[] = [ '#384182', '#ffffff' ];
  showBTC: boolean = false;
  showETH: boolean = false;
  showNANO: boolean = false;
  showRVN: boolean = false;

  constructor(public dialogRef: MatDialogRef<QrCodesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { 
  }

  ngOnInit() {
    this.selectedCoin = this.coins[0];
    this.showBTC = true;
    this.btc = environment.btc;
    this.eth = environment.eth;
    this.nano = environment.nano;
    this.rvn = environment.rvn;
  }

  onSelect(event) {
    this.showBTC = this.showETH = this.showNANO = this.showRVN = false;
    if(this.selectedCoin === "BTC") {
      this.showBTC = true;
    } else if (this.selectedCoin === "ETH") {
      this.showETH = true;
    } else if (this.selectedCoin === "NANO") {
      this.showNANO = true;
    } else if (this.selectedCoin === "RVN") {
      this.showRVN = true;
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
