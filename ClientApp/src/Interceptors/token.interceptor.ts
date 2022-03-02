import { Injectable } from '@angular/core';
import
{
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { CookieNames } from 'src/Helpers/constants';

@Injectable()
export class TokenInterceptor implements HttpInterceptor
{

  constructor(private CookieService: CookieService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
  {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.CookieService.get(CookieNames.XSRF_TOKEN)}`
      }
    });
    return next.handle(request);
  }
}
