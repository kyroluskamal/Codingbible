import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FormControlNames } from 'src/Helpers/constants';
import { CustomErrorStateMatcher } from 'src/Helpers/custom-error-state-matcher';
import { CardTitle, SelectedTextData } from 'src/Interfaces/interfaces';
import { Post } from 'src/models.model';
import { PostService } from 'src/Services/post.service';
import { selectPinned } from 'src/State/DesignState/design.reducer';
import { select_Post_ValidationErrors } from 'src/State/PostState/post.reducer';
import * as Constants from '../../../Helpers/constants';

@Component({
  selector: 'app-post-handler',
  templateUrl: './post-handler.component.html',
  styleUrls: ['./post-handler.component.css']
})
export class PostHandlerComponent implements OnInit, OnChanges
{
  ValidationErrors$ = this.store.select(select_Post_ValidationErrors);
  pinned = Boolean(localStorage.getItem(Constants.LocalStorageKeys.FixedSidnav));
  Constants = Constants;
  validators = Validators;
  CustoErrorStateMatcher = new CustomErrorStateMatcher();
  selectedText: SelectedTextData = {
    text: "",
    start: -1,
    end: -1,
    anchorNode: null,
    focusNode: null
  };
  pinned$ = this.store.select(selectPinned);
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private store: Store, private postService: PostService)
  {
    this.form = this.inputForm;

  }
  ngOnChanges(changes: SimpleChanges): void
  {
    if ('inputForm' in changes)
    {
      this.form = this.inputForm;
    }
  }
  @Input() inputForm: FormGroup = new FormGroup({});
  @Input() post: Post = new Post();
  @Input() Title: CardTitle[] = [];
  @Output() Save: EventEmitter<FormGroup> = new EventEmitter();
  ngOnInit(): void
  {

  }
  UpdateView(html: HTMLTextAreaElement, view: HTMLDivElement)
  {
    view.innerHTML = html.value;
  }

  UpdateHtml(html: HTMLTextAreaElement, view: HTMLDivElement)
  {
    this.form.get(FormControlNames.postForm.htmlContent)?.setValue(view.innerHTML);

    html.value = view.innerHTML;
  }
  GetData()
  {
  }

  CreateSlug(title: HTMLInputElement, slug: HTMLInputElement)
  {
    slug.value = title.value.trim().split(' ').join("-");
    this.form.get('slug')?.setValue(slug.value);
  }
  GetSelectedText(view: HTMLDivElement)
  {
    if (window.getSelection)
    {
      var txt = view.innerText;
      var selection = window.getSelection();
      var start = selection?.anchorOffset;
      var end = selection?.focusOffset;
      // console.log('start at postion', start, 'in node', selection?.anchorNode);
      // console.log('stop at position', end, 'in node', selection?.focusNode);

      this.selectedText = {
        text: selection!?.toString(),
        start: start!,
        end: end!,
        anchorNode: selection?.anchorNode,
        focusNode: selection?.focusNode
      };
      // console.log(this.selectedText.anchorNode?.parentElement?.outerHTML);
    }
    else if (document.getSelection())
    {
      var txt = view.innerText;
      var selection = document.getSelection();
      var start = selection?.anchorOffset;
      var end = selection?.focusOffset;
      console.log('start at postion', start, 'in node', selection?.anchorNode);
      console.log('stop at position', end, 'in node', selection?.anchorNode);
      console.log('stop at position 222222', end, 'in node', selection?.focusNode);
      this.selectedText = {
        text: selection!?.toString(),
        start: start!,
        end: end!,
        anchorNode: selection?.anchorNode,
        focusNode: selection?.focusNode
      };
    }
  }
  SaveClicked(view: HTMLDivElement)
  {
    console.log("from Handler");

    this.form.get(FormControlNames.postForm.htmlContent)?.setValue(view.innerHTML);
    this.Save.emit(this.form);
  }
  CheckIfSulgNotUnique(slug: HTMLInputElement)
  {
    console.log(this.form);
    this.postService.IsSlugUnique(slug.value).subscribe(
      r =>
      {
        if (!r)
          this.form.get('slug')?.setErrors({ notUnique: true });
        else
          this.form.get('slug')?.clearValidators();
      }
    );
  }
}
