import { Component, OnInit } from '@angular/core';
import { VolumeOverAverge } from 'src/app/classes/volume-over-average.class';
import { ApiService } from 'src/app/services/api.service';
import { PagedResponse } from 'src/app/classes/paged-response.class';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-volume-over-average',
  templateUrl: './volume-over-average.component.html',
  styleUrls: ['./volume-over-average.component.css']
})
export class VolumeOverAverageComponent implements OnInit {
  items: VolumeOverAverge[] = [];
  filtered: VolumeOverAverge[] = [];
  symbolSort: string = "";
  loading: boolean = false;
  useBtc: boolean = true;
  useUsdt: boolean = true;
  selectedInterval: string = "All";
  getComplete: boolean = true;
  page: number = 0;
  size: number = 75;
  selectedIdx: number = 0;
  selectedDaily: string = "";
  dailies: string[] = [];

  constructor(private apiSvc: ApiService, private snack: MatSnackBar) {
    this.dailies = [ '1000 Day', '30 Day', '60 Day', '100 Day', '200 Day', '365 Day' ];
    this.selectedDaily = this.dailies[0];
   }

  ngOnInit() {
    if(this.items.length === 0) {
      this.loading = true;
      this.onGetRecords();
    }
  }

  async onGetRecords() {
    this.getComplete = false;
    this.apiSvc.getVOAPaged(this.page, this.size)
        .subscribe(res => {
          console.log(`returning page ${this.page}`);
          this.loading = false;
          this.onProcessResults(res);
        });
  }

  async onProcessResults(res: PagedResponse<VolumeOverAverge[]>) {
    res.data.forEach(item => {
      item.diff = this.getDiff(item);
      item.url = this.getUrl(item);
      this.items.push(item);
      this.filtered.push(item);
    });
    if(res.page === res.pages) {
      this.getComplete = true;
      this.onAlertComplete();
    } else {
      this.page++;
      await this.onGetRecords();
    }
  }

  onAlertComplete() {
    this.snack.open(`Data pull complete`, null, {
      duration: 3000
    })
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

  onSort() {
    if(this.symbolSort === "" || this.symbolSort === "asc") {
      this.filtered = this.filtered.sort((a, b) => (a.symbol > b.symbol) ? 1 : -1)
    } else {
      this.filtered = this.filtered.sort((a, b) => (a.symbol < b.symbol) ? 1 : -1)
    }
  }

  getDiff(item: any) {
    let decimals = item.symbol.indexOf("USDT") > 0 ? 7 : 8;
    let result = +item.close - +item.open;

    let final = result.toFixed(decimals);
    if(+item.close > +item.open) {
      final = `+${final}`;
    }
    return final;
  }

  getUrl(item: any): string {
    if(item.exchange === "BINANCE") {
      let symbol = item.symbol;
      if(symbol.endsWith("BTC")) {
        symbol = symbol.replace("BTC", "_BTC");        
      } else {
        symbol = symbol.replace("USDT", "_USDT");
      }
      return `https://www.binance.com/en/trade/pro/${symbol}`;
    }
  }

  onDailySelect(event) {
    console.log('selection', event);
  }
}
