import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SocketioService } from 'src/app/services/socket.service';
import { CustomInterval } from 'src/app/classes/custom-interval.class';
import { OptionsComponent } from '../options/options.component';
import { QrCodesComponent } from '../qr-codes/qr-codes.component';
import { ApiService } from 'src/app/services/api.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-volumes',
  templateUrl: './volumes.component.html',
  styleUrls: ['./volumes.component.css']
})
export class VolumesComponent implements OnInit {
  dataSetId: string = "";
  messageNumber: number = 0;
  items: CustomInterval[] = [];
  loading: boolean = false;
  symbolSort: string = "";
  filtered: CustomInterval[] = [];
  useBtc: boolean = true;
  useUsdt: boolean = true;
  intervals: string[] = [];
  selectedInterval: string = "All";

  constructor(private apiSvc: ApiService,
              private coreSvc: CoreService,
              private socketSvc: SocketioService, 
              public dialog: MatDialog) { }

  ngOnInit() {
    this.loading = true;
    this.apiSvc.getCurrent()
        .subscribe(res => {
          this.loading = false;
          this.items = res;
          this.items.forEach(item => {
            item.diff = this.coreSvc.getDiff(item);
            item.exchangeUrl = this.coreSvc.getExchangeUrl(item);
            item.callbackUrl = "";
          });
          this.intervals = [...new Set(this.items.map(i => i.size))];
          if(this.intervals.length > 1) {
            this.intervals.unshift('All');
          }
          this.onBaseChange();
        });
    this.socketSvc.listen('volumes', (msg) => {
      this.loading = false;
      console.log('Reading incoming messge', msg);
      let volumes: number[] = [];
      msg.volume.forEach(vol => {
          volumes.push(+vol);
      })
      const newItem: CustomInterval = {
        id: 0,
        close: msg.close,
        closeTime: msg.close,
        exchange: msg.exchange,
        high: msg.high,
        open: msg.open,
        low: msg.low,
        volume: volumes,
        size: msg.size,
        symbol: msg.symbol,
        diff: this.coreSvc.getDiff(msg),
        exchangeUrl: this.coreSvc.getExchangeUrl(msg),
        callbackUrl: ""
      };
      this.items.push(newItem);
      this.filtered.push(newItem);
      this.intervals = [...new Set(this.items.map(i => i.size))];
      if(this.intervals.length > 1) {
        this.intervals.unshift('All');
      }
      this.selectedInterval = 'All';
    });
  }

  onGetData() {
    this.messageNumber = 0;
    this.items = [];
    this.filtered = [];
    this.loading = true;
    this.socketSvc.send('custom sent', this.dataSetId);
  }

  onOpenOptions() {
    const dialogRef = this.dialog.open(OptionsComponent, {
      width: '300px',
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        this.dataSetId = res;
        if(this.dataSetId !== "") {
          this.onGetData();
        }
      });
  }

  onOpenDonate() {
    const dialogRef = this.dialog.open(QrCodesComponent, {
      width: '300px',
      disableClose: true
    });
  }

  onSymbolSort() {
    if(this.symbolSort === "" || this.symbolSort === "desc") {
      this.symbolSort = "asc";
    } else {
      this.symbolSort = "desc";
    }
    this.onSort();
  }

  onSort() {
    if(this.symbolSort === "" || this.symbolSort === "asc") {
      this.filtered = this.filtered.sort((a, b) => (a.symbol > b.symbol) ? 1 : -1)
    } else {
      this.filtered = this.filtered.sort((a, b) => (a.symbol < b.symbol) ? 1 : -1)
    }
  }

  onBtcChange(event) {
    if(!this.useBtc && !this.useUsdt) {
      this.useUsdt = true;
    }
    this.onBaseChange();
  }

  onUsdtChange(event) {
    if(!this.useBtc && !this.useUsdt) {
      this.useBtc = true;
    }
    this.onBaseChange();
  }

  onBaseChange() {
    this.loading = true;
    this.filtered = [];
    if(this.useBtc && this.useUsdt) {
      this.filtered = this.items;
    } else if(this.useBtc && !this.useUsdt) {
      this.filtered = this.items.filter(i => i.symbol.endsWith("BTC"));
    } else if(!this.useBtc && this.useUsdt) {
      this.filtered = this.items.filter(i => i.symbol.endsWith("USDT"));
    }

    if(this.selectedInterval !== "" && this.selectedInterval !== "All") {
      this.filtered = this.filtered.filter(f => f.size === this.selectedInterval);
    }

    this.onSort();
    this.loading = false;
  }

  onIntervalSelect(event) {
    this.onBaseChange();
  }
}
