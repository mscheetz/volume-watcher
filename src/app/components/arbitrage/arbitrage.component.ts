import { Component, OnInit, DoCheck } from '@angular/core';
import { SocketioService } from 'src/app/services/socket.service';
import { Arbitrage } from 'src/app/classes/arbitrage.class';

@Component({
  selector: 'app-arbitrage',
  templateUrl: './arbitrage.component.html',
  styleUrls: ['./arbitrage.component.css']
})
export class ArbitrageComponent implements OnInit, DoCheck {
  items: Arbitrage[][] = [];
  loading: boolean = false;
  allData: boolean = false;
  processingItem: boolean = false;

  constructor(private socketSvc: SocketioService) { }

  ngOnInit() {
    this.socketSvc.send('arbitrage', {});
    if(this.items.length === 0) {
      this.socketSvc.listen('arbitrage-items', (item) => {
        this.loading = false;
        if(item === null) {
          this.allData = true;
        } else {
          this.onProcessItem(item);
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
