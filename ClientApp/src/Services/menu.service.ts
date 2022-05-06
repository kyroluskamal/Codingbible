import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenusController } from 'src/Helpers/apiconstants';

@Injectable({
  providedIn: 'root'
})
export class MenuService
{

  constructor(private httpClient: HttpClient) { }

  getMenus()
  {
    return this.httpClient.get(MenusController.GetMenus);
  }
}
