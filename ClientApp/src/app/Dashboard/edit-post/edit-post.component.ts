import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { FormControlNames, PostType } from 'src/Helpers/constants';
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
  constructor(private fb: FormBuilder, private store: Store, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.minLength(60), Validators.maxLength(70)]],
      slug: [null],
      excerpt: [null, [Validators.required]],
      description: [null, [Validators.required, Validators.minLength(50), Validators.maxLength(160)]],
      htmlContent: [null, [Validators.required]]
    });
  }

}
