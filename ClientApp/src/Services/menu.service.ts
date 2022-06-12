import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenusController } from 'src/Helpers/apiconstants';
import { HttpResponsesObject, Menu, MenuLocations } from 'src/models.model';
import { ApiCallService } from './api-call.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends ApiCallService<Menu>
{

  constructor(private HttpClient: HttpClient)
  {
    super(HttpClient);
  }

  GetMenuByLocationName(LocationName: string)
  {
    return this.HttpClient.get<Menu>(`${MenusController.GetMenuByLocationName}/${LocationName}`);
  }
  DeleteMenuItem(MenuItemId: number)
  {
    return this.HttpClient.delete<HttpResponsesObject>(`${MenusController.DeleteMenuItem}/${MenuItemId}`);
  }
  GetMenuLocations()
  {
    return this.HttpClient.get<MenuLocations[]>(`${MenusController.GetMenuLocations}`);
  }
}
