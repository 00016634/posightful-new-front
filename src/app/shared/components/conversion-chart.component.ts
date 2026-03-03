import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsCoreOption } from 'echarts';

@Component({
  selector: 'app-conversion-chart',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './conversion-chart.component.html',

  styleUrl: './conversion-chart.component.css',
})
export class ConversionChartComponent implements OnChanges {
  @Input() labels: string[] = [];
  @Input() datasets: { name: string; data: number[]; color?: string }[] = [];
  @Input() height = '300px';
  @Input() chartType: 'line' | 'bar' | 'area' = 'line';

  chartOptions: EChartsCoreOption = {};

  ngOnChanges(_changes: SimpleChanges) {
    this.chartOptions = {
      tooltip: { trigger: 'axis' },
      legend: {
        data: this.datasets.map(d => d.name),
        bottom: 0,
      },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: this.labels,
        boundaryGap: this.chartType === 'bar',
      },
      yAxis: { type: 'value' },
      series: this.datasets.map(d => ({
        name: d.name,
        type: this.chartType === 'area' ? 'line' as const : this.chartType,
        data: d.data,
        smooth: true,
        areaStyle: this.chartType === 'area' ? {} : undefined,
        itemStyle: d.color ? { color: d.color } : undefined,
      })),
    };
  }
}
