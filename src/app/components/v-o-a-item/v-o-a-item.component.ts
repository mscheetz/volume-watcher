import { Component, OnInit, Input } from '@angular/core';
import { VolumeOverAverge } from 'src/app/classes/volume-over-average.class';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-v-o-a-item',
  templateUrl: './v-o-a-item.component.html',
  styleUrls: ['./v-o-a-item.component.css']
})
export class VOAItemComponent implements OnInit {
  @Input() item: VolumeOverAverge;
  chartOptions: ChartOptions = {
    legend: {
      display: false
    },
    //responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          display: false
        }
      }]
    },
    tooltips: {
      enabled: false
    }
  };
  type: ChartType = 'bar';
  chartData1d: ChartDataSets[] = [];
  chartData3d: ChartDataSets[] = [];
  chartData1w: ChartDataSets[] = [];

  constructor() { }

  ngOnInit() {
    const norm = 'rgba(0, 0, 0, 46)';
    const oa = 'rgba(255, 0, 0, 1)';
    for(let i = 0; i < this.item.volume1d.length; i++) {
      const dataSet1d: ChartDataSets = {
        backgroundColor: +this.item.volume1d[i] > +this.item.volAvg[0] ? oa : norm,
        data: [+this.item.volume1d[i]]
      }
      this.chartData1d.push(dataSet1d);
      
      if(this.item.volume3d.length >= (i + 1)) {
        const dataSet3d: ChartDataSets = {
          backgroundColor: +this.item.volume3d[i] > +this.item.volAvg[6] ? oa : norm,
          data: [+this.item.volume3d[i]]
        }
        this.chartData3d.push(dataSet3d);
      }
      if(this.item.volume1w.length >= (i + 1)) {
        const dataSet1w: ChartDataSets = {
          backgroundColor: +this.item.volume1w[i] > +this.item.volAvg[7] ? oa : norm,
          data: [+this.item.volume1w[i]]
        }
        this.chartData1w.push(dataSet1w);
      }
    }
    // this.item.volume1d.forEach(vol => {
    //   const dataSet: ChartDataSets = {
    //     backgroundColor: norm,
    //     //barThickness: 8,
    //     data: [+vol]
    //   }
    //   this.chartData1d.push(dataSet);
    // });    
    // this.item.volume3d.forEach(vol => {
    //   const dataSet: ChartDataSets = {
    //     backgroundColor: +vol > +this.item.volAvg[6] ? oa : norm,
    //     //barThickness: 8,
    //     data: [+vol]
    //   }
    //   this.chartData3d.push(dataSet);
    // });
    // this.item.volume1w.forEach(vol => {
    //   const dataSet: ChartDataSets = {
    //     backgroundColor: +vol > +this.item.volAvg[7] ? oa : norm,
    //     //barThickness: 8,
    //     data: [+vol]
    //   }
    //   this.chartData1w.push(dataSet);
    // });
  }

  getDiff(item: VolumeOverAverge) {
    let decimals = item.symbol.indexOf("USDT") > 0 ? 5 : 8;
    let result = +item.close - +item.open;

    return result.toFixed(decimals);
  }
}