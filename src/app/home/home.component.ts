import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private apiService: ApiService) {}
  total_operation: 0;
  total_completed_operation: 0;
  total_uncompleted_operation: 0;
  total_station: 0;
  ngOnInit(): void {
    this.apiService.getStatistics().subscribe((response: any) => {
      this.total_operation = response.data.total_operation;
      this.total_completed_operation = response.data.total_completed_operation;
      this.total_uncompleted_operation =
        response.data.total_uncompleted_operation;
      this.total_station = response.data.total_station;
    });
  }
  chartHeight: number = (509 / 1080) * window.innerHeight;
  dataFormat = 'json';

  pieData = {
    chart: {
      caption: 'Phân loại công việc',
      showPercentInTooltip: '0',
      showPercentValues: '0',
      showLabels: '0',
      showValues: '0',
      decimals: '1',
      useDataPlotColorForLabels: '0',
      paletteColors: '018162, 004AAE, C91828',
      theme: 'fusion',
    },
    data: [
      {
        label: 'Xử lí lỗi thiết bị Tủ',
        value: '285040',
      },
      {
        label:
          'Xử lý lỗi  RRU, lỗi dây quang, lỗi Feeder, Jumper và anten 2G, 3G, 4G',
        value: '146330',
      },
      {
        label: 'Công việc khác ….',
        value: '105070',
      },
    ],
  };

  lineData = {
    chart: {
      theme: 'fusion',
      paletteColors: '018162, 1BCBA1',
      caption: 'Năng suất làm việc theo tháng',
      subcaption: 'Tháng 1 - Tháng 5',
      showhovereffect: '1',
      drawcrossline: '1',
      plottooltext: '<b>$dataValue</b> $seriesName',
    },
    categories: [
      {
        category: [
          {
            label: 'Tháng 1',
          },
          {
            label: 'Tháng 2',
          },
          {
            label: 'Tháng 3',
          },
          {
            label: 'Tháng 4',
          },
          {
            label: 'Tháng 5',
          },
        ],
      },
    ],
    dataset: [
      {
        seriesname: 'Tổng số công việc',
        data: [
          {
            value: '62',
          },
          {
            value: '64',
          },
          {
            value: '64',
          },
          {
            value: '66',
          },
          {
            value: '78',
          },
        ],
      },
      {
        seriesname: 'Số lượng công việc đã hoàn thành',
        data: [
          {
            value: '16',
          },
          {
            value: '28',
          },
          {
            value: '34',
          },
          {
            value: '42',
          },
          {
            value: '54',
          },
        ],
      },
    ],
  };
}
