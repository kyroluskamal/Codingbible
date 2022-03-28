import { Injectable } from '@angular/core';
import { HTTPResponseStatus } from 'src/Helpers/constants';
import { ModelStateErrors } from 'src/Interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GetServerErrorResponseService
{

  constructor() { }
  GetModelStateErrors(ModelStateErrors: any): ModelStateErrors[]
  {
    let errors: ModelStateErrors[] = [];
    let keys = Object.keys(ModelStateErrors);
    for (let k of keys)
    {
      for (let e of ModelStateErrors[k])
      {
        errors.push({ key: k, message: e });
      }
    }
    return errors;
  }
  GetIdentityErrors(identityErrors: any[]): ModelStateErrors[]
  {
    let errors: ModelStateErrors[] = [];

    for (let e of identityErrors)
    {
      if (e.code === "InvalidToken") continue;
      errors.push({ key: e.code, message: e.description });
    }

    return errors;
  }

  GetServerSideValidationErrors(e: any): ModelStateErrors[]
  {
    let errors: ModelStateErrors[] = [];
    if (e["error"]["errors"])
      errors.push(...this.GetModelStateErrors(e.error.errors));
    else if (e.error.status === HTTPResponseStatus.identityErrors)
    {
      errors.push(...this.GetIdentityErrors(e.error.message));
    }
    else if (e.error.status !== 400)
    {
      errors.push({ key: e.error.status, message: e.error.message });
    }
    return errors;
  }
}
