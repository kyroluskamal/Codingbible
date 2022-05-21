import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit
{

  constructor(private title: Title) { }

  ngOnInit(): void
  {
    this.title.setTitle("Register");
  }

}
