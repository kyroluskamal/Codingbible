import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { FormControlNames, PostType, validators } from 'src/Helpers/constants';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { CardTitle } from 'src/Interfaces/interfaces';
import { Post } from 'src/models.model';
import { GetPostById, RemovePOST, UpdatePOST } from 'src/State/PostState/post.actions';
import { selectPostByID } from 'src/State/PostState/post.reducer';

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
      title: [null, [validators.required, validators.POST_TITLE_MIN_LENGTH, validators.POST_TITLE_MAX_LENGTH]],
      slug: [null],
      excerpt: [null, [validators.required]],
      description: [null, [validators.required, validators.POST_DESCRIPTION_MIN_LENGTH, validators.POST_DESCRIPTION_MAX_LENGTH]],
      htmlContent: [null, [validators.required]]
    });
  }

}
