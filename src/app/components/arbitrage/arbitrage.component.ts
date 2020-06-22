import { Component, OnInit, DoCheck } from '@angular/core';
import { SocketioService } from 'src/app/services/socket.service';
import { Arbitrage } from 'src/app/classes/arbitrage.class';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-arbitrage',
  templateUrl: './arbitrage.component.html',
  styleUrls: ['./arbitrage.component.css']
})
export class ArbitrageComponent implements OnInit, DoCheck {
  items: Arbitrage[][] = [];
  notFound: boolean = false;
  loading: boolean = false;
  allData: boolean = false;
  processingItem: boolean = false;

  constructor(private socketSvc: SocketioService, private coreSvc: CoreService) { }

  ngOnInit() {
    this.loading = true;
    this.notFound = false;
    this.items = [];
    this.socketSvc.send('arbitrage', {});
    if(this.items.length === 0) {
      this.socketSvc.listen('arbitrage-items', (item) => {
        if(item === null) {
          this.loading = false;
          this.notFound = true;
        } else {
          if(this.coreSvc.getSubArray(this.items, 'id', item[0].id).length === 0) {
            if(item === null) {
              this.allData = true;
            } else {
              this.loading = false;
              this.onProcessItem(item);
            }
          }
        }
      });
    }
  }

  ngDoCheck() {
  }

  onProcessItem(item: Arbitrage[]) {
      this.processingItem = true;
      this.items.push(item);
      this.processingItem = false;
  }
}
