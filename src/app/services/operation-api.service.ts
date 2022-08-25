import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, filter, scan } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OperationApiService {
  baseUrl = 'http://localhost:8000';

  constructor(private httpClient: HttpClient) {}

  public getOperationList(page: any) {
    return this.httpClient
      .get(`${this.baseUrl}/operation?p=${page}`)
      .pipe(map((res) => res));
  }

  public completeOperation(operation: any) {
    return this.httpClient
      .post(`${this.baseUrl}/operation/complete`, operation, {
        observe: 'response',
      })
      .pipe(
        map((data) => {
          return data.status;
        })
      );
  }

  public searchOperationList(
    stationCode: any,
    startDate: any,
    endDate: any,
    status: any,
    page: any
  ) {
    const url = `${this.baseUrl}/operation/q?stationCode=${stationCode}&startDate=${startDate}&endDate=${endDate}&status=${status}&p=${page}`;
    return this.httpClient
      .get(url.replace('null', '').replace('null', ''))
      .pipe(map((res) => res));
  }

  public updateOperation(operation: any) {
    return this.httpClient
      .post(`${this.baseUrl}/operation/update`, operation, {
        observe: 'response',
      })
      .pipe(
        map((data) => {
          return data.status;
        })
      );
  }

  public insertOperation(operation: any) {
    return this.httpClient
      .put(`${this.baseUrl}/operation`, operation, {
        observe: 'response',
      })
      .pipe(
        map((data) => {
          return data.status;
        })
      );
  }

  public getOpeartorStation() {
    return this.httpClient
      .get(`${this.baseUrl}/station/operator`)
      .pipe(map((res) => res));
  }
}
