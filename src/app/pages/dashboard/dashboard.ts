import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NzCardModule,
    NzStatisticModule,
    NgxEchartsModule
  ],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: {
        echarts: () => import('echarts')
      }
    }
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  totalExamRounds = 3;
  totalExamSlots = 12;
  totalStaff = 58;
  totalMoney = 120000000;

  labels = ['Đợt thi', 'Ca thi', 'Cán bộ', 'Tiền (VNĐ)'];
  values = [this.totalExamRounds, this.totalExamSlots, this.totalStaff, this.totalMoney];

  // CONNECTED SCATTERPLOT
  chartOptions = {
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: this.labels
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Giá trị',
        type: 'line',
        data: this.values,
        symbol: 'circle',
        symbolSize: 12,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#1890ff',
          borderColor: '#0050b3',
          borderWidth: 2
        }
      }
    ]
  };

}
