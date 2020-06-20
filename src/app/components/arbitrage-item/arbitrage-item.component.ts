import { Component, OnInit, Input } from '@angular/core';
import { Arbitrage } from 'src/app/classes/arbitrage.class';

@Component({
  selector: 'app-arbitrage-item',
  templateUrl: './arbitrage-item.component.html',
  styleUrls: ['./arbitrage-item.component.css']
})
export class ArbitrageItemComponent implements OnInit {
  @Input() items: Arbitrage[];

  constructor() { }

  ngOnInit() {
    console.log(`items: ${this.items}`);
  }

}
