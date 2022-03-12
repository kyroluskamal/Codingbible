import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { FormControlNames, validators } from 'src/Helpers/constants';
import { Post } from 'src/models.model';
import { AddPOST } from 'src/State/PostState/post.actions';
import { PostType } from '../../../Helpers/constants';

@Component({
  selector: 'app-add-posts',
  templateUrl: './add-posts.component.html',
  styleUrls: ['./add-posts.component.css']
})
export class AddPostsComponent implements OnInit
{
  PostType = PostType;
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, public store: Store,
    private cliendSideService: ClientSideValidationService) { }

  ngOnInit(): void
  {
    this.form = this.fb.group({
      title: [null, [validators.required, validators.POST_TITLE_MIN_LENGTH, validators.POST_TITLE_MAX_LENGTH]],
      slug: [null],
      excerpt: [null, [validators.required]],
      description: [null, [validators.required, validators.POST_DESCRIPTION_MIN_LENGTH, validators.POST_DESCRIPTION_MAX_LENGTH]],
      htmlContent: [null, [validators.required]]
    });

  }
  SaveOrPublish(event: FormGroup, type: string)
  {
    let newPost = new Post();
    this.cliendSideService.FillObjectFromForm(newPost, event);
    newPost.slug = String(event.get(FormControlNames.postForm.slug)?.value).split(' ').join('-');
    if (type == "publish")
      newPost.status = 1;
    else if (type == "draft")
      newPost.status = 0;
    this.store.dispatch(AddPOST(newPost));
  }
}
