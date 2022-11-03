import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, filter, scan } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = environment.baseUrl;

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

  public getStatistics() {
    return this.httpClient
      .get(`${this.baseUrl}/statistics`)
      .pipe(map((res) => res));
  }

  public getTopOperations() {
    return this.httpClient
      .get(`${this.baseUrl}/statistics/top`)
      .pipe(map((res) => res));
  }

  public insertUpdateStations(stations: any) {
    return this.httpClient
      .post(`${this.baseUrl}/insert-update-station`, stations, {
        observe: 'response',
      })
      .pipe(
        map((data) => {
          return data.body;
        })
      );
  }
}
