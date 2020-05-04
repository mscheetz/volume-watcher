import { Component, OnInit } from '@angular/core';
import { View } from './classes/enum.class';
import { MatDialog } from '@angular/material/dialog';
import { QrCodesComponent } from './components/qr-codes/qr-codes.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from './services/api.service';
import { VolumeOverAverge } from './classes/volume-over-average.class';
import { CoreService } from './services/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'volume-watcher';
  view: View = View.VOA;
  viewName: string;
  symbol: string = "";
  items: VolumeOverAverge[] = [];
  dailyIdx: number = 0;
  selectedDaily: string = '1000 Day';
  ready: boolean = false;

  constructor(public dialog: MatDialog, 
              private router: Router,
              private route: ActivatedRoute,
              private apiSvc: ApiService,
              private coreSvc: CoreService) {
  }

  ngOnInit() {
    let routerList = [];
    let symbol = "";
    this.router.events.subscribe((router: any) => {
      if(!this.ready) {
        this.ready = true;
        let routerUrl = router.url;
        if (routerUrl && typeof routerUrl === 'string') {
          routerList = routerUrl.slice(1).split('/');
          console.log('router list', routerList);
          if(routerList.length == 2 && routerList[0] === 'voa') {          
            symbol = routerList[1];
          }          
          if(symbol !== "") {
            this.symbol = symbol;
            this.loadDetail();          
          } else {
            this.loadVOA();
          }
        }
      }
    });
  }

  loadDetail() {
    this.view = View.Detail;
    this.viewName = `Volume Over Average`;
    this.onGetVOA();
  }

  loadVOA() {
    this.view = View.VOA;
    this.viewName = 'Volume Increase';
  }

  onToggleView(event) {
    if(this.view === View.VOA) {
      this.view = View.Volume;
      this.viewName = `Volume Over Average`;
    } else {
      this.view = View.VOA;
      this.viewName = `Volume Increase`;
    }
  }

  onOpenDonate() {
    const dialogRef = this.dialog.open(QrCodesComponent, {
      width: '300px',
      disableClose: true
    });
  }

  onGetVOA() {
    this.apiSvc.getVOABySymbol(this.symbol)
        .subscribe(res => {
          this.items = [];
          res.forEach(r => {
            r.diff = this.coreSvc.getDiff(r);
            r.exchangeUrl = this.coreSvc.getExchangeUrl(r);
            r.callbackUrl = this.coreSvc.getCallbackUrl(r);
            this.items.push(r);
          })
        })
  }
}
