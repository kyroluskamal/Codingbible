import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ActivationStart, NavigationEnd, NavigationExtras, ResolveEnd, Router, RoutesRecognized } from '@angular/router';


@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {
  error: any;
  back: string = "";
  @Input("extras") extras: any;
  constructor(private router: Router, private location: Location) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.error == null) this.GoToHome();
    this.error = navigation?.extras?.state?.error; 
  }

  ngOnInit(): void { }
  GoToHome() {
    this.location.back();
  }
}

