import { Injectable } from '@angular/core';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { NotificationMessage } from 'src/Helpers/constants';
import { Category } from 'src/models.model';
import { UpdateCATEGORY_Sucess } from 'src/State/CategoriesState/Category.actions';
import { selectAllCategorys } from 'src/State/CategoriesState/Category.reducer';
import { NotificationsService } from './notifications.service';
@Injectable({
  providedIn: 'root'
})
export class ServerResponseHandelerService
{

  constructor(
    private NotificationService: NotificationsService) { }


  DatatAddition_Success_Swal()
  {
    this.NotificationService.Success_Swal(NotificationMessage.Success.DataAddtionStatus_Success);
  }

  Data_Updaed_Success_Swal()
  {
    this.NotificationService.Success_Swal(NotificationMessage.Success.Data_SAVED_success);
  }

  GeneralSuccessResponse_Swal(SuncessResponse: string)
  {
    return this.NotificationService.Success_Swal(SuncessResponse);
  }

  GetGeneralError_Swal(title: string, confirmText: string, message: string)
  {
    return this.NotificationService.Error_Swal(title, confirmText, message);
  }

}
