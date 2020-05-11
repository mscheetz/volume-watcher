import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { VolumeOverAverge } from 'src/app/classes/volume-over-average.class';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-v-o-a-item',
  templateUrl: './v-o-a-item.component.html',
  styleUrls: ['./v-o-a-item.component.css']
})
export class VOAItemComponent implements OnInit, OnChanges {
  @Input() item: VolumeOverAverge;
  @Input() dailyIdx: number;
  @Input() dailyName: string;
  dailyVal: string;
  chartOptions: ChartOptions = {
    legend: {
      display: false
    },
    responsive: true,
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
        offset: false,
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
  norm: string = 'rgba(0, 0, 0, 46)';
  oa: string = 'rgba(255, 0, 0, 1)';

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.chartData1d = [];
    this.chartData3d = [];
    this.chartData1w = [];
    for(let i = 0; i < this.item.volume1d.length; i++) {
      this.setDailyChart(i);
      if(this.item.volume3d.length >= (i + 1)) {
        const dataSet3d: ChartDataSets = {
          backgroundColor: +this.item.volume3d[i] > +this.item.volAvg[6] ? this.oa : this.norm,
          hoverBackgroundColor: +this.item.volume3d[i] > +this.item.volAvg[6] ? this.oa : this.norm,
          data: [+this.item.volume3d[i]],
          categoryPercentage: 1
        }
        this.chartData3d.push(dataSet3d);
      }
      if(this.item.volume1w.length >= (i + 1)) {
        const dataSet1w: ChartDataSets = {
          backgroundColor: +this.item.volume1w[i] > +this.item.volAvg[7] ? this.oa : this.norm,
          hoverBackgroundColor: +this.item.volume1w[i] > +this.item.volAvg[7] ? this.oa : this.norm,
          data: [+this.item.volume1w[i]],
          categoryPercentage: 1
        }
        this.chartData1w.push(dataSet1w);
      }
    }
  }

  ngOnChanges() {
    this.updateDailyChart();
  }

  setDailyChart(i: number) {
    const dailyVal = +this.dailyName.replace(" Day", "");
    if(dailyVal > +this.item.stickLen[0]) {
      this.dailyVal = `${this.item.stickLen[0]} Day (max)`;
    } else {
      this.dailyVal = this.dailyName;
    }
    const dataSet1d: ChartDataSets = {
      backgroundColor: +this.item.volume1d[i] > +this.item.volAvg[this.dailyIdx] ? this.oa : this.norm,
      hoverBackgroundColor: +this.item.volume1d[i] > +this.item.volAvg[this.dailyIdx] ? this.oa : this.norm,
      data: [+this.item.volume1d[i]],
      categoryPercentage: 1
    }
    this.chartData1d.push(dataSet1d);
  }

  updateDailyChart() {  
    this.chartData1d = [];  
    for(let i = 0; i < this.item.volume1d.length; i++) {
      this.setDailyChart(i);
    }
  }

  getDiff(item: VolumeOverAverge) {
    let decimals = item.symbol.indexOf("USDT") > 0 ? 5 : 8;
    let result = +item.close - +item.open;

    return result.toFixed(decimals);
  }

  copySuccess(event) {
    this.snackBar.open(`Link copied to clip board`, null, {duration: 2000});
  }

  isHot(): boolean {
    let hotness = this.item.voaPercent && (+this.item.voaPercent[6] > 2 || +this.item.voaPercent[7] > 2);

    return hotness
  }
}