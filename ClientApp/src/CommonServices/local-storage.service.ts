import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public localStorageValue: Subject<any> = new Subject<any>();
  constructor() { }

  get(key: any) {
    this.localStorageValue.next(window.localStorage.getItem(key));
  }

  set(key: any, value: any) {
    window.localStorage.setItem(key, value)
    this.get(key);
  }

  remove(key: any) {
    localStorage.removeItem(key);
    this.get(key);
  }
}
