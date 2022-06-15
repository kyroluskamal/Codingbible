import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { FormControlNames, PostType, validators } from 'src/Helpers/constants';
import { Post, PostAttachments } from 'src/models.model';
import { AddPOST } from 'src/State/PostState/post.actions';

@Component({
  selector: 'app-add-posts',
  templateUrl: './add-posts.component.html',
  styleUrls: ['./add-posts.component.css']
})
export class AddPostsComponent implements OnInit
{
  PostType = PostType;
  form: FormGroup = new FormGroup({});
  newPost = new Post();
  constructor(private fb: FormBuilder, public store: Store, public router: Router,
    private cliendSideService: ClientSideValidationService) { }

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
      [FormControlNames.postForm.isArabic]: [false],
      [FormControlNames.postForm.otherSlug]: [null, [validators.required]],
    });

  }
  SaveOrPublish(event: FormGroup, type: string)
  {
    this.cliendSideService.FillObjectFromForm(this.newPost, event);
    this.newPost.slug = String(event.get(FormControlNames.postForm.slug)?.value).split(' ').join('-');
    if (type == "publish")
      this.newPost.status = 1;
    else if (type == "draft")
      this.newPost.status = 0;
    this.store.dispatch(AddPOST(this.newPost));
  }
  GetPostAttachments(PostAttachments: number[])
  {
    this.newPost.tempAttach = PostAttachments;
  }
}
