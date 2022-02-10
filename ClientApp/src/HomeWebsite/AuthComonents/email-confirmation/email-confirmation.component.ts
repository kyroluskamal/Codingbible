import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogHandlerService } from '../../../CommonServices/dialog-handler.service';
import { AccountService } from '../../../Services/account.service';
import * as Constants from '../../../Helpers/constants';
import * as Routes from '../../../Helpers/router-constants';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpResponsesObject } from 'src/models.model';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit
{
  Routes = Routes;

  //properties
  Success: boolean = false;
  Fail: boolean = false;
  Error: HttpResponsesObject = new HttpResponsesObject();

  //constructor
  constructor(private route: ActivatedRoute, private router: Router,
    private accountService: AccountService, public dialogHandler: DialogHandlerService,
  ) { }
  //ngOnInit
  ngOnInit(): void
  {

    const email = this.route.snapshot.queryParamMap.get(Constants.AuthConstants.email);
    const token = this.route.snapshot.queryParamMap.get(Constants.AuthConstants.token);
    console.log(email);
    if (email && token)
    {
      this.accountService.EmailConfirmations(email, token).subscribe(
        {
          next: r => { this.Success = true; },
          error: (e: HttpErrorResponse) =>
          {
            this.Fail = true;
            this.Error = e.error;
            console.log(e);
          }
        }
      );
    } else
    {
      this.router.navigateByUrl("/");
    }
  }



}
