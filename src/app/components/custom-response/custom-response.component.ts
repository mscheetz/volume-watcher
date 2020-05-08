import { Component, OnInit, Input } from '@angular/core';
import { CustomInterval } from 'src/app/classes/custom-interval.class';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-custom-response',
  templateUrl: './custom-response.component.html',
  styleUrls: ['./custom-response.component.css']
})
export class CustomResponseComponent implements OnInit {
  @Input() item: CustomInterval;
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
  chartData: ChartDataSets[] = [];

  constructor() { 
  }

  ngOnInit() {
    let i = 0;
    this.item.volume.forEach(vol => {
      const dataSet: ChartDataSets = {
        backgroundColor: 'rgba(255, 0, 0, 1)',
        hoverBackgroundColor: 'rgba(255, 0, 0, 1)',
        //barThickness: 8,
        data: [vol],
        categoryPercentage: 1
      }
      this.chartData.push(dataSet);
    })
  }

  getDiff(item: CustomInterval) {
    let decimals = item.symbol.indexOf("USDT") > 0 ? 5 : 8;
    let result = +item.close - +item.open;

    return result.toFixed(decimals);
  }
}
