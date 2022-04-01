import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import
{
  FormControlNames, LocalStorageKeys, PostType, FormFieldsNames,
  FormValidationErrors, FormValidationErrorsNames
} from 'src/Helpers/constants';
import { CustomErrorStateMatcher } from 'src/Helpers/custom-error-state-matcher';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { SelectedTextData } from 'src/Interfaces/interfaces';
import { Post } from 'src/models.model';
import { PostService } from 'src/Services/post.service';
import { selectUser } from 'src/State/AuthState/auth.reducer';
import { selectPinned } from 'src/State/DesignState/design.reducer';
import { ChangeStatus, GetPostById, GetPostById_Success, RemovePOST, UpdatePOST } from 'src/State/PostState/post.actions';
import { selectAllposts, selectPostByID, select_Post_ValidationErrors } from 'src/State/PostState/post.reducer';

@Component({
  selector: 'app-post-handler',
  templateUrl: './post-handler.component.html',
  styleUrls: ['./post-handler.component.css']
})
export class PostHandlerComponent implements OnInit, OnChanges
{
  ValidationErrors$ = this.store.select(select_Post_ValidationErrors);
  pinned = Boolean(localStorage.getItem(LocalStorageKeys.FixedSidnav));
  PostType = PostType;
  FormControlNames = FormControlNames;
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  FormFieldsNames = FormFieldsNames;
  @Input() inputForm: FormGroup = new FormGroup({});
  post: Post = new Post();
  @Input() postType: string = "";
  @Output() Update: EventEmitter<Post> = new EventEmitter();
  @Output() Publish: EventEmitter<FormGroup> = new EventEmitter();
  @Output() Draft: EventEmitter<FormGroup> = new EventEmitter();
  @Output() Delete: EventEmitter<number> = new EventEmitter();
  @ViewChild("view", { read: ElementRef }) view: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild("html", { read: ElementRef }) html: ElementRef<HTMLTextAreaElement> = {} as ElementRef<HTMLTextAreaElement>;
  @ViewChild("slug", { read: ElementRef }) slug: ElementRef<HTMLInputElement> = {} as ElementRef<HTMLInputElement>;
  validators = Validators;
  CustoErrorStateMatcher = new CustomErrorStateMatcher();
  selectedText: SelectedTextData = {
    text: "",
    start: -1,
    end: -1,
    anchorNode: null,
    focusNode: null
  };
  Type: string = "";
  posts: Post[] = [];
  pinned$ = this.store.select(selectPinned);
  posts$ = this.store.select(selectAllposts);
  user$ = this.store.select(selectUser);
  postById = this.store.select(selectPostByID);
  form: FormGroup = new FormGroup({});
  postTitle: string = '';
  IsUpdated: boolean = false;
  constructor(public store: Store, private postService: PostService,
    public ClientSideService: ClientSideValidationService, public router: ActivatedRoute)
  {
    this.form = this.inputForm;
    this.Type = this.postType;
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if ('inputForm' in changes)
    {
      this.form = this.inputForm;
    }
    if ('postType' in changes)
    {
      this.Type = this.postType;
    }
  }

  ngOnInit(): void
  {
    if (this.Type === PostType.Edit)
    {
      this.postById.subscribe(r =>
      {
        this.post = Object.assign({}, r);
        this.ClientSideService.refillForm(r, this.form);
      });
    }
    this.router.queryParams.subscribe(x =>
    {
      if (x['id'])
        this.store.dispatch(GetPostById({ id: Number(x['id']) }));
    });

  }
  UpdateView(html: HTMLTextAreaElement, view: HTMLDivElement)
  {
    view.innerHTML = html.value;
  }

  UpdateHtml(html: HTMLTextAreaElement, view: HTMLDivElement)
  {
    this.form.get(FormControlNames.postForm.htmlContent)?.setValue(view.innerHTML);
    this.post.title = String(this.form.get(FormControlNames.postForm.title)?.value);
    this.post.description = String(this.form.get(FormControlNames.postForm.description)?.value);
    this.post.excerpt = String(this.form.get(FormControlNames.postForm.excerpt)?.value);
    this.post.htmlContent = this.view.nativeElement.innerHTML;
    this.post.slug = String(this.slug.nativeElement.value);
    this.post.author = null;
    html.value = view.innerHTML;
  }
  // GetData()
  // {
  // }

  CreateSlug(title: HTMLInputElement, slug: HTMLInputElement)
  {
    this.post.title = String(this.form.get(FormControlNames.postForm.title)?.value);
    this.post.description = String(this.form.get(FormControlNames.postForm.description)?.value);
    this.post.excerpt = String(this.form.get(FormControlNames.postForm.excerpt)?.value);
    this.post.htmlContent = this.view.nativeElement.innerHTML;
    this.post.slug = String(this.slug.nativeElement.value);
    this.post.author = null;
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
      this.selectedText = {
        text: selection!?.toString(),
        start: start!,
        end: end!,
        anchorNode: selection?.anchorNode,
        focusNode: selection?.focusNode
      };
    }
    else if (document.getSelection())
    {
      var txt = view.innerText;
      var selection = document.getSelection();
      var start = selection?.anchorOffset;
      var end = selection?.focusOffset;
      this.selectedText = {
        text: selection!?.toString(),
        start: start!,
        end: end!,
        anchorNode: selection?.anchorNode,
        focusNode: selection?.focusNode
      };
    }
  }
  UpdateClicked()
  {
    this.post.title = String(this.form.get(FormControlNames.postForm.title)?.value);
    this.post.description = String(this.form.get(FormControlNames.postForm.description)?.value);
    this.post.excerpt = String(this.form.get(FormControlNames.postForm.excerpt)?.value);
    this.post.htmlContent = this.view.nativeElement.innerHTML;
    this.post.slug = String(this.slug.nativeElement.value);
    this.post.author = null;
    this.store.dispatch(UpdatePOST(this.post));
  }
  DraftOrPublish(view: HTMLDivElement, draftOrPublish: string)
  {
    this.form.get(FormControlNames.postForm.htmlContent)?.setValue(view.innerHTML);
    if (draftOrPublish === "Draft")
      this.Draft.emit(this.form);
    else
      this.Publish.emit(this.form);
  }
  CheckIfSulgNotUnique(slug: HTMLInputElement)
  {
    if (this.Type === PostType.Add)
    {
      this.isSlugUnique(slug);
    } else if (this.Type === PostType.Edit && this.ClientSideService.isUpdated(this.post, this.form))
    {
      this.isSlugUnique(slug);
    }
  }
  DeleteClicked()
  {
    this.store.dispatch(RemovePOST({ id: this.post?.id!, url: DashboardRoutes.Posts.EditPost }));
  }

  isSlugUnique(slug: HTMLInputElement)
  {
    this.posts$.subscribe(x => this.posts = x);

    if (this.posts.length > 0)
    {
      if (!this.ClientSideService.isUnique(this.posts, 'slug', slug.value))
        this.form.get('slug')?.setErrors({ notUnique: true });
      else
        this.form.get('slug')?.clearValidators();
    } else
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
  changeStatus(status: number)
  {
    this.post.status = status;
    this.store.dispatch(ChangeStatus(this.post));
  }
}
