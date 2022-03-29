import { Injectable } from '@angular/core';
import { NotificationMessage } from 'src/Helpers/constants';
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
    this.NotificationService.Success_Swal(SuncessResponse);
  }

  GetGeneralError_Swal(title: string, confirmText: string, message: string)
  {
    this.NotificationService.Error_Swal(title, confirmText, message);
  }

}
