import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-add-edit-categories',
  templateUrl: './add-edit-categories.component.html',
  styleUrls: ['./add-edit-categories.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditCategoriesComponent implements OnInit
{

  @Input() Type: string = "";
  form: any;
  constructor() { }

  ngOnInit(): void
  {
  }

}
