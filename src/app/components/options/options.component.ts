import { Component, OnInit, Output, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { RequestItem } from 'src/app/classes/request-item.class';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  @Output() socketId: string = ""
  exchanges: string[] = [];
  sizes: string[] = [];
  selectedExchange: string = "";
  selectedInterval: string = "";
  selectedPercent: number = 25;
  percentInput: number;
  useBtc: boolean = true;
  useUsdt: boolean = true;
  btnDisabled: boolean = true;

  constructor(private apiSvc: ApiService,
    public dialogRef: MatDialogRef<OptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { 
      this.percentInput = this.selectedPercent;
    }

  ngOnInit() {
    this.apiSvc.getExchanges()
        .subscribe(res => {
          this.exchanges = res;
        });
    this.apiSvc.getIntervals()
        .subscribe(res => {
          this.sizes = res;
        });
  }

  onExchangeSelect(event) {
    this.checkGoStatus();
  }

  onIntervalSelect(event) {
    this.checkGoStatus();
  }

  onSliderChange(event) {
    this.percentInput = this.selectedPercent;
    this.checkGoStatus();
  }

  onPercentKeyDown(event) {
    this.selectedPercent = this.percentInput;
    this.checkGoStatus();
  }

  onBtcChange(event) {
    this.checkGoStatus();
  }

  onUsdtChange(event) {
    this.checkGoStatus();
  }

  onExit(event) {
    this.dialogRef.close("");
  }

  onGo(event) {
    const percent = this.selectedPercent / 100;
    const data: RequestItem = {
      exchange: this.selectedExchange,
      size: this.selectedInterval,
      percent: percent,
      btc: this.useBtc,
      usdt: this.useUsdt
    };
    this.apiSvc.executeCustomRun(data)
        .subscribe(res => {
          this.socketId = res;
          this.dialogRef.close(this.socketId);
        });
  }

  checkGoStatus(){
    this.btnDisabled = true;
    if(this.selectedExchange === "") {
      return;      
    }
    if(this.selectedInterval === "") {
      return;
    }
    if(this.selectedPercent === 0) {
      return;
    }
    if(!this.useBtc && !this.useUsdt) {
      return;
    }
    this.btnDisabled = false;
  }
}
