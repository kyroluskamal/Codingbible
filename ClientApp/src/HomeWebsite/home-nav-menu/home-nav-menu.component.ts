import { Component, OnInit } from '@angular/core';
import { DialogHandlerService } from '../../CommonServices/dialog-handler.service';

@Component({
  selector: 'app-home-nav-menu',
  templateUrl: './home-nav-menu.component.html',
  styleUrls: ['./home-nav-menu.component.css']
})
export class HomeNavMenuComponent implements OnInit
{

  constructor(public dialogHandler: DialogHandlerService) { }

  ngOnInit(): void
  {
  }

}
