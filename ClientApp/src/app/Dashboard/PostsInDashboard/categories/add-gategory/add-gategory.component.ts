import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-gategory',
  templateUrl: './add-gategory.component.html',
  styleUrls: ['./add-gategory.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddGategoryComponent implements OnInit
{

  AddForm: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void
  {
  }

}
