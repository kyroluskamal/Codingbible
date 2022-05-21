import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControlNames, PostType, validators } from 'src/Helpers/constants';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit
{
  PostType = PostType;
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void
  {
    this.form = this.fb.group({
      [FormControlNames.postForm.title]: [null, [validators.required, validators.SEO_TITLE_MIN_LENGTH, validators.SEO_TITLE_MAX_LENGTH]],
      [FormControlNames.postForm.slug]: [null],
      [FormControlNames.postForm.excerpt]: [null, [validators.required]],
      [FormControlNames.postForm.description]: [null, [validators.required, validators.SEO_DESCRIPTION_MIN_LENGTH, validators.SEO_DESCRIPTION_MAX_LENGTH]],
      [FormControlNames.postForm.htmlContent]: [null, [validators.required]],
      [FormControlNames.postForm.featureImageUrl]: [null, [validators.required]],
      [FormControlNames.postForm.categories]: [[], [validators.required]],
    });
  }

}
