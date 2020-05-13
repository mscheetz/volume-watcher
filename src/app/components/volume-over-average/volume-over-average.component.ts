import { Component, OnInit,  HostListener, Input, DoCheck } from '@angular/core';
import { VolumeOverAverge } from 'src/app/classes/volume-over-average.class';
import { ApiService } from 'src/app/services/api.service';
import { PagedResponse } from 'src/app/classes/paged-response.class';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketioService } from 'src/app/services/socket.service';
import { CoreService } from 'src/app/services/core.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-volume-over-average',
  templateUrl: './volume-over-average.component.html',
  styleUrls: ['./volume-over-average.component.css']
})
export class VolumeOverAverageComponent implements OnInit, DoCheck {
  @Input() pairs: string[];
  selectedPair: string = "";
  thePair: string = "";
  items: VolumeOverAverge[] = [];
  filtered: VolumeOverAverge[] = [];
  symbolSort: string = "";
  loading: boolean = false;
  useBtc: boolean = true;
  useUsdt: boolean = true;
  hotOnes: boolean = false;
  selectedInterval: string = "All";
  getComplete: boolean = true;
  page: number = -1;
  size: number = 25;
  dailyIdx: number = 0;
  selectedDaily: string = "";
  dailies: string[] = [];
  selectedIndicator: string = "Select";
  indicators: string[] = [];
  allData: boolean = false;
  threeDAccum: boolean = false;
  weeklyAccum: boolean = false;
  processingItem: boolean = false;

  constructor(private apiSvc: ApiService,
              private coreSvc: CoreService,
              private snack: MatSnackBar,
              private socketSvc: SocketioService,
              private router: Router) {
    this.dailies = [ '1000 Day', '30 Day', '60 Day', '100 Day', '200 Day', '365 Day' ];
    this.indicators = [ 'Select', '3 Day', 'Weekly' ];
    this.selectedDaily = this.dailies[0];
   }

  ngOnInit() {
    if(this.items.length === 0) {
      this.socketSvc.listen('voa-items', (item) => {
        this.loading = false;
        if(item === null) {
          this.allData = true;
        } else {
          this.onProcessItem(item);
        }
      });
      this.getSocketPage();
    }
  }

  ngDoCheck() {
    if(this.selectedPair !== this.thePair) {
      this.thePair = this.selectedPair;
      this.pairCheck();
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
      this.onProcessItem(item);
    });
    if(res.page === res.pages) {
      this.getComplete = true;
      this.onAlertComplete();
    } else {
      this.page++;
      await this.onGetRecords();
    }
  }

  onProcessItem(item: VolumeOverAverge) {
    if(this.items.filter(i => i.symbol === item.symbol).length === 0) {
      this.processingItem = true;
      item.diff = this.coreSvc.getDiff(item);
      item.exchangeUrl = this.coreSvc.getExchangeUrl(item);
      item.callbackUrl = this.coreSvc.getCallbackUrl(item);
      this.items.push(item);
      this.onBaseChange();
      this.processingItem = false;
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
    this.unHighlightAll();

    if(this.hotOnes) {
      this.filtered = this.items.filter(i => +i.voaPercent[6] > 2 || +i.voaPercent[7] > 2);
      this.selectedIndicator = 'Select';
    } else {
      if(this.selectedIndicator === '3 Day') {
        this.filtered = this.items.filter(i => i.accumulation3D === true);
      } else if(this.selectedIndicator === 'Weekly') {
        this.filtered = this.items.filter(i => i.accumulationWeekly === true);
      } else {
        this.filtered = this.items;
      }
    }
    
    if(this.useBtc && !this.useUsdt) {
       this.filtered = this.filtered.filter(i => i.symbol.endsWith("BTC"));
    } else if(!this.useBtc && this.useUsdt) {
       this.filtered = this.filtered.filter(i => i.symbol.endsWith("USDT"));
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

  onDailySelect(event) {
    this.dailyIdx = this.dailies.indexOf(this.selectedDaily);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    let position = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    if(position === max) {
      this.getSocketPage();
    }
  }

  getSocketPage(){
    if(!this.allData) {
      this.page++;
      this.loading = true;
      this.socketSvc.send('voa-paged', { page: this.page, size: this.size });
    }
  }

  onIndicatorSelect(event) {
    this.onBaseChange();
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

  onHotOneChange(event) {
    this.onBaseChange();
  }

  pairCheck() {
    if(this.items.filter(i => i.symbol === this.thePair).length > 0) {
      this.scrollTo();
    } else {
      this.onGetPair();
    }
  }

  onGetPair() {
    this.apiSvc.getVOABySymbol(this.thePair)
        .subscribe(datas => {
          datas.forEach(data => {
            this.onProcessItem(data);
            data.highlight = true;
            const idx = this.coreSvc.getIndex(this.filtered, "symbol", data.symbol);
            if(idx >= 0) {
              this.filtered.splice(idx, 1);
            }
            this.filtered.unshift(data);
          });
        })
  }

  scrollTo() {
    this.highlightSelected();
    const element = document.querySelector("#" + this.selectedPair);
    if(element) {
      element.scrollIntoView(true);
    }
  }

  unHighlightAll() {
    this.items.forEach(item => {
      item.highlight = false;
    })
    if(this.filtered.length > 0) {
      this.filtered.forEach(item => {
        item.highlight = false;
      })
    }
  }

  highlightSelected() {
    this.unHighlightAll();
    let idx = this.coreSvc.getIndex(this.items, 'symbol', this.selectedPair);
    if(idx >= 0) {
      this.items[idx].highlight = true;
    }
    idx = this.coreSvc.getIndex(this.filtered, 'symbol', this.selectedPair);
    if(idx >= 0) {
      this.filtered[idx].highlight = true;
    }
  }
}
