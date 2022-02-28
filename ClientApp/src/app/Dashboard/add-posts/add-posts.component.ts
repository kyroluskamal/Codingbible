import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { FormControlNames } from 'src/Helpers/constants';
import { CardTitle, SelectedTextData } from 'src/Interfaces/interfaces';
import { Post } from 'src/models.model';
import { AddPOST } from 'src/State/PostState/post.actions';

@Component({
  selector: 'app-add-posts',
  templateUrl: './add-posts.component.html',
  styleUrls: ['./add-posts.component.css']
})
export class AddPostsComponent implements OnInit
{
  Title: CardTitle[] = [{ text: "Add new post", needTranslation: false }];
  selectedText: SelectedTextData = {
    text: "",
    start: -1,
    end: -1,
    anchorNode: null,
    focusNode: null
  };
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private store: Store,
    private cliendSideService: ClientSideValidationService) { }

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
  Save(event: FormGroup)
  {
    console.log("from add post");

    let newPost = new Post();
    this.cliendSideService.FillObjectFromForm(newPost, event);
    newPost.slug = String(event.get(FormControlNames.postForm.slug)?.value).split(' ').join('-');
    this.store.dispatch(AddPOST(newPost));

  }
}
