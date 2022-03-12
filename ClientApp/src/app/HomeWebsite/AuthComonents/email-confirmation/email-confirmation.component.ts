import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogHandlerService } from '../../../../CommonServices/dialog-handler.service';
import { AccountService } from '../../../../Services/account.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpResponsesObject } from 'src/models.model';
import { AuthConstants, ConstRegex } from 'src/Helpers/constants';
import { AuthRoutes } from 'src/Helpers/router-constants';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit
{
  //properties
  AuthRoutes = AuthRoutes;
  Success: boolean = false;
  Fail: boolean = false;
  Error: HttpResponsesObject = new HttpResponsesObject();
  email: string | null = "";
  token: string | null = "";
  //constructor
  constructor(public route: ActivatedRoute, public router: Router,
    public accountService: AccountService,
  ) { }
  //ngOnInit
  ngOnInit(): void
  {

    this.email = this.route.snapshot.queryParamMap.get(AuthConstants.email);
    this.token = this.route.snapshot.queryParamMap.get(AuthConstants.token);
    if (this.email && this.token || !ConstRegex.EmailRegex.test(this.email!))
    {
      this.accountService.EmailConfirmations(this.email!, this.token!).subscribe(
        {
          next: r => { this.Success = true; },
          error: (e: HttpErrorResponse) =>
          {
            this.Fail = true;
            this.Error = e.error;
          }
        }
      );
    } else
    {
      this.router.navigateByUrl("/");
    }
  }
}
