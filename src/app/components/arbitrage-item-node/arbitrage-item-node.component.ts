import { Component, OnInit, Input } from '@angular/core';
import { Arbitrage } from 'src/app/classes/arbitrage.class';

@Component({
  selector: 'app-arbitrage-item-node',
  templateUrl: './arbitrage-item-node.component.html',
  styleUrls: ['./arbitrage-item-node.component.css']
})
export class ArbitrageItemNodeComponent implements OnInit {
  @Input() node: Arbitrage;

  constructor() { }

  ngOnInit() {
  }

}
