import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  _username: string = '';

  _usernameSource: Subject<string> = new Subject();

  get usernameSource(): Subject<string> {
    return this._usernameSource;
  }

  set usernameSource(src: Subject<string>) {
    this._usernameSource = src;
  }

  changeUsername(n: string) {
    this.usernameSource.next(n);
  }
}
