import { Component, OnInit, Input } from '@angular/core';
import { Arbitrage } from 'src/app/classes/arbitrage.class';

@Component({
  selector: 'app-arbitrage-item',
  templateUrl: './arbitrage-item.component.html',
  styleUrls: ['./arbitrage-item.component.css']
})
export class ArbitrageItemComponent implements OnInit {
  @Input() items: Arbitrage[];
  possible: boolean = false;
  possiblity: string;

  constructor() { }

  ngOnInit() {
    let possible = true;
    this.items.forEach(i => {
      if(!i.possible) {
        possible = false;
      }
    });
    this.possible = possible;
    this.possiblity = this.items[this.items.length - 1].orderBookValue > 100 ? 'Possible' : 'Not Possible';
  }

}
