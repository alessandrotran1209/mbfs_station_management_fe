import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, filter, scan } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'http://localhost:8000';

  constructor(private httpClient: HttpClient) {}

  public getStationCodeList() {
    return this.httpClient
      .get(`${this.baseUrl}/station/station_code`)
      .pipe(map((res) => res));
  }

  public getStationList(page: any) {
    return this.httpClient
      .get(`${this.baseUrl}/station?p=${page}`)
      .pipe(map((res) => res));
  }

  public searchStation(code: any, province: any, district: any, page: any) {
    return this.httpClient
      .get(
        `${this.baseUrl}/station/q?code=${code}&province=${province}&district=${district}&p=${page}`
      )
      .pipe(map((res) => res));
  }
}
