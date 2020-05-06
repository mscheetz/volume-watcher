import { Component, OnInit, HostListener } from '@angular/core';
import { VolumeOverAverge } from 'src/app/classes/volume-over-average.class';
import { ApiService } from 'src/app/services/api.service';
import { PagedResponse } from 'src/app/classes/paged-response.class';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketioService } from 'src/app/services/socket.service';
import { CoreService } from 'src/app/services/core.service';

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
              private socketSvc: SocketioService ) {
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
    this.processingItem = true;
    item.diff = this.coreSvc.getDiff(item);
    item.exchangeUrl = this.coreSvc.getExchangeUrl(item);
    item.callbackUrl = this.coreSvc.getCallbackUrl(item);
    let threeDayCount = 0;
    let weeklyCount = 0;
    let threeDayContinue = true;
    let weeklyContinue = true;
    for(let i = item.volume3d.length - 1; i >= 0; i --) {
      let latest3d = i === item.volume3d.length - 1 ? true : false;
      if(latest3d && +item.volume3d[i-1] > +item.volAvg[6]) {
        threeDayCount++;
      } else if(threeDayContinue && +item.volume3d[i] > +item.volAvg[6]) {
        threeDayCount++;
      } else {
        threeDayContinue = false;
      }
      if(item.volume1w.length >= (i + 1)) {
        let latest1w = i === item.volume1w.length - 1 ? true : false;
        if(latest1w && +item.volume1w[i-1] > +item.volAvg[7]) {
          weeklyCount++;
        } else if(weeklyContinue && +item.volume1w[i] > +item.volAvg[7]) {
          weeklyCount++;
        } else {
          weeklyContinue = false;
        }
      }
      if(!threeDayContinue && !weeklyContinue) {
        break;
      }
    }
    item.accumulation3D = threeDayCount > 1 ? true : false;
    item.accumulationWeekly = weeklyCount > 1 ? true : false;
    this.items.push(item);
    this.onBaseChange();
    this.processingItem = false;
    //this.filtered.push(item);
  }

  onAlertComplete() {
    this.snack.open(`Data pull complete`, null, {
      duration: 3000
    })
  }

  onBaseChange() {
    this.loading = true;
    this.filtered = [];

    if(this.selectedIndicator === '3 Day') {
      this.filtered = this.items.filter(i => i.accumulation3D === true);
    } else if(this.selectedIndicator === 'Weekly') {
      this.filtered = this.items.filter(i => i.accumulationWeekly === true);
    } else {
      this.filtered = this.items;
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
}
