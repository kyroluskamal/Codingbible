import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogHandlerService } from '../../../../CommonServices/dialog-handler.service';
import { AccountService } from '../../../../Services/account.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpResponsesObject } from 'src/models.model';
import { AuthConstants } from 'src/Helpers/constants';
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
  Success: boolean = true;
  Fail: boolean = false;
  Error: HttpResponsesObject = new HttpResponsesObject();
  email: string | null = "";
  token: string | null = "";
  //constructor
  constructor(private route: ActivatedRoute, private router: Router,
    private accountService: AccountService, public dialogHandler: DialogHandlerService,
  ) { }
  //ngOnInit
  ngOnInit(): void
  {

    // this.email = this.route.snapshot.queryParamMap.get(AuthConstants.email);
    // this.token = this.route.snapshot.queryParamMap.get(AuthConstants.token);
    // if (this.email && this.token)
    // {
    //   this.accountService.EmailConfirmations(this.email, this.token).subscribe(
    //     {
    //       next: r => { this.Success = true; },
    //       error: (e: HttpErrorResponse) =>
    //       {
    //         this.Fail = true;
    //         this.Error = e.error;
    //         console.log(e);
    //       }
    //     }
    //   );
    // } else
    // {
    //   this.router.navigateByUrl("/");
    // }
  }
}
