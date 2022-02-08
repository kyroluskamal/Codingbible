import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class sessionStorageService {

  public SessionStorageValue: Subject<any> = new Subject<any>();
  constructor() { }

  get(key: any) {
    this.SessionStorageValue.next(window.sessionStorage.getItem(key));
  }

  set(key: any, value: any) {
    window.sessionStorage.setItem(key, value)
    this.get(key);
  }

  remove(key: any) {
    window.sessionStorage.removeItem(key);
    this.get(key);
  }
}
