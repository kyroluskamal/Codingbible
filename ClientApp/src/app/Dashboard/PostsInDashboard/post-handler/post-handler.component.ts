import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import
{
  FormControlNames, LocalStorageKeys, PostType, FormFieldsNames,
  FormValidationErrors, FormValidationErrorsNames, BaseUrl, PostStatus, ArabicRegex
} from 'src/Helpers/constants';
import { CustomErrorStateMatcher } from 'src/Helpers/custom-error-state-matcher';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { SelectedTextData } from 'src/Interfaces/interfaces';
import { Attachments, Category, Post } from 'src/models.model';
import { PostService } from 'src/Services/post.service';
import { SelectAttachment } from 'src/State/Attachments/Attachments.actions';
import { selectUser } from 'src/State/AuthState/auth.reducer';
import { LoadCATEGORYs } from 'src/State/CategoriesState/Category.actions';
import { selectAllCategorys, selectCategoryIds } from 'src/State/CategoriesState/Category.reducer';
import { SetValidationErrors } from 'src/State/PostState/post.actions';
import { selectPinned } from 'src/State/DesignState/design.reducer';
import { ChangeStatus, GetPostById, RemovePOST, UpdatePOST } from 'src/State/PostState/post.actions';
import { selectAllposts, selectPostByID, selectPostBySlug, select_Post_ValidationErrors } from 'src/State/PostState/post.reducer';
import { Title } from '@angular/platform-browser';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';

@Component({
  selector: 'app-post-handler',
  templateUrl: './post-handler.component.html',
  styleUrls: ['./post-handler.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class PostHandlerComponent implements OnInit, OnChanges, AfterViewInit
{
  ValidationErrors$ = this.store.select(select_Post_ValidationErrors);
  pinned = Boolean(localStorage.getItem(LocalStorageKeys.FixedSidnav));
  PostType = PostType;
  FormControlNames = FormControlNames;
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  FormFieldsNames = FormFieldsNames;
  DashboardRoutes = DashboardRoutes;
  errorState = new BootstrapErrorStateMatcher();
  cats$ = this.store.select(selectAllCategorys);
  AllCategories: Category[] = [];
  CategoriesByLang: Category[] = [];
  postsAttachments: number[] = [];
  @Input() inputForm: FormGroup = new FormGroup({});
  post: Post = new Post();
  BaseUrl = BaseUrl;
  @Input() postType: string = "";
  viewWidth: number = window.innerWidth;
  viewHeight: number = window.innerHeight;
  selectedTranslation: Post[] = [];
  @Output() Update: EventEmitter<Post> = new EventEmitter();
  @Output() Publish: EventEmitter<FormGroup> = new EventEmitter();
  @Output() Draft: EventEmitter<FormGroup> = new EventEmitter();
  @Output() Delete: EventEmitter<number> = new EventEmitter();
  @Output() ChosenAttachment: EventEmitter<number[]> = new EventEmitter<number[]>();
  @ViewChild("view", { read: ElementRef }) view: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild("StickyNotesHandler", { read: ElementRef }) StickyNotesHandler: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild("StickyNotesContainerPost", { read: ElementRef }) StickyNotesContainer: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild("StickyNotes", { read: ElementRef }) StickyNotes: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild("html", { read: ElementRef }) html: ElementRef<HTMLTextAreaElement> = {} as ElementRef<HTMLTextAreaElement>;
  @ViewChild("slug", { read: ElementRef }) slug: ElementRef<HTMLInputElement> = {} as ElementRef<HTMLInputElement>;
  mousex: number = 0;
  mousey: number = 0;
  validators = Validators;
  CustoErrorStateMatcher = new CustomErrorStateMatcher();
  selectedText: SelectedTextData = {
    Range: new Range(),
    text: "",
    start: -1,
    end: -1,
    anchorNode: null,
    focusNode: null,
    mouseX: this.mousex,
    mouseY: this.mousey
  };
  stickyNodeIsOpened: boolean = false;
  Type: string = "";
  posts: Post[] = [];
  pinned$ = this.store.select(selectPinned);
  posts$ = this.store.select(selectAllposts);
  user$ = this.store.select(selectUser);
  postById = new Observable<any>();
  form: FormGroup = new FormGroup({});
  postTitle: string = '';
  sideBarWidth: number = 0;
  IsUpdated: boolean = false;
  selectedCategories: number[] = [];
  categoriesIds = this.store.select(selectCategoryIds);
  modal_fullscreen = "modal-fullscreen";

  /**********************************************************************************************************
   *                                                Constructor
   ************************************************************************************/
  constructor(public store: Store, private postService: PostService,
    @Inject(DOCUMENT) private document: Document, private title: Title,
    private router: Router,
    public ClientSideService: ClientSideValidationService, public ActivatedRoute: ActivatedRoute)
  {
    this.form = this.inputForm;
    this.Type = this.postType;
  }
  ngAfterViewInit(): void
  {
    this.document.body.append(this.StickyNotesContainer.nativeElement);
    this.StickyNotesContainer.nativeElement.style.zIndex = "1 !important";
    let matSideNav = this.document.getElementsByTagName('mat-sidenav')[0];
    this.pinned$.subscribe((x) =>
    {
      if (x)
      {
        this.sideBarWidth = (<HTMLElement>matSideNav).offsetWidth;
        this.closeStickyNotes();
      } else
      {
        this.sideBarWidth = 0;
        this.closeStickyNotes();
      }
    });
    this.StickyNotesContainer.nativeElement.style.transform = `translate(${this.viewWidth -
      this.StickyNotesHandler.nativeElement.offsetWidth}px,${this.viewHeight * -1 + this.viewHeight * 0.13}px)`;
  }
  ToggleStickyNotes()
  {
    this.stickyNodeIsOpened = !this.stickyNodeIsOpened;
    this.StickyNotesContainer.nativeElement.style.transition = "all 0.5s ease-in-out";
    if (this.stickyNodeIsOpened)
      this.StickyNotesContainer.nativeElement.style.transform = `translate(${this.viewWidth -
        this.StickyNotesContainer.nativeElement.offsetWidth}px,${this.viewHeight * -1 + this.viewHeight * 0.13}px)`;
    else
      this.StickyNotesContainer.nativeElement.style.transform = `translate(${this.viewWidth -
        this.StickyNotesHandler.nativeElement.offsetWidth}px,${this.viewHeight * -1 + this.viewHeight * 0.13}px)`;
  }
  // openStickyNotes()
  // {
  //   this.stickyNodeIsOpened = true;
  //   this.StickyNotesContainer.nativeElement.style.transition = "all 0.5s ease-in-out";
  //   this.StickyNotesContainer.nativeElement.style.transform = `translate(${this.viewWidth -
  //     this.StickyNotesContainer.nativeElement.offsetWidth - 20 - this.sideBarWidth}px,${this.viewHeight * 0.001}px)`;
  // }
  closeStickyNotes()
  {
    this.stickyNodeIsOpened = false;
    this.StickyNotesContainer.nativeElement.style.transition = "all 0.5s ease-in-out";
    this.StickyNotesContainer.nativeElement.style.transform = `translate(${this.viewWidth -
      this.StickyNotesHandler.nativeElement.offsetWidth}px,${this.viewHeight * -1 + this.viewHeight * 0.13}px)`;
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
      this.SelectTranslation();
    }
  }

  ngOnInit(): void
  {
    this.posts$.subscribe(x => { this.posts = x; this.SelectTranslation(); });

    window.addEventListener('resize', () =>
    {
      this.viewWidth = window.innerWidth;
      this.viewHeight = window.innerHeight;
      this.stickyNodeIsOpened = false;
      this.StickyNotesContainer.nativeElement.style.transform = `translate(${this.viewWidth -
        this.StickyNotesHandler.nativeElement.offsetWidth}px,${this.viewHeight * -1 + this.viewHeight * 0.13}px)`;
    });
    this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
    this.document.addEventListener("mousemove", (e) =>
    {
      this.mousex = e.pageX;
      this.mousey = e.pageY;
    });
    this.store.dispatch(LoadCATEGORYs());

    this.ActivatedRoute.queryParams.subscribe(x =>
    {
      if (x['id'])
      {
        this.store.dispatch(GetPostById({ id: Number(x['id']) }));
        this.postById = this.store.select(selectPostByID(Number(x['id'])));
      }
    });
    if (this.Type === PostType.Edit)
    {
      this.postById.subscribe(r =>
      {
        if (r)
        {
          this.SelectTranslation();
          let post = r as Post;
          this.selectedCategories = [];
          post.postsCategories.forEach(x => this.selectedCategories.push(x.categoryId));
          this.post = Object.assign({}, r);
          this.form.patchValue(this.post);
          this.form.get(FormControlNames.postForm.categories)?.setValue(this.selectedCategories);
          this.title.setTitle(`Edit post - ${this.post.title}`);
          if (this.post.status === PostStatus.Published)
          {
            this.form.get(FormControlNames.postForm.isArabic)?.disable();
          }
          this.post.featureImageUrl = this.post.featureImageUrl.includes("http") ? this.post.featureImageUrl : `${this.BaseUrl}${this.post.featureImageUrl}`;
          let tempAttachments = [];
          for (let i = 0; i < post?.attachments.length!; i++)
          {
            tempAttachments.push(post.attachments[i].attachmentId);
          }
          if (this.post.otherSlug === null)
          {
            this.form.get(FormControlNames.postForm.otherSlug)?.setValue("0");
          }
          this.postsAttachments = tempAttachments;
          this.setIsArabic(FormControlNames.postForm.title);
        }
        this.form.markAllAsTouched();
      });
    }
    this.cats$.subscribe(x => { this.AllCategories = x; this.SelectTranslation(); });
    this.posts$.subscribe(x => { this.posts = x; this.SelectTranslation(); });
    if (this.postType === PostType.Add)
    {
      this.title.setTitle("Add new post");
    }
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

  CreateSlug(title: HTMLInputElement, slug: HTMLInputElement)
  {
    this.post.title = String(this.form.get(FormControlNames.postForm.title)?.value);
    this.post.description = String(this.form.get(FormControlNames.postForm.description)?.value);
    this.post.excerpt = String(this.form.get(FormControlNames.postForm.excerpt)?.value);
    this.post.htmlContent = this.view.nativeElement.innerHTML;
    this.post.slug = this.ClientSideService.GenerateSlug(this.post.title);
    this.post.author = null;
    slug.value = this.ClientSideService.GenerateSlug(this.post.title);
    this.form.get('slug')?.setValue(this.post.slug);
  }
  GetSelectedText()
  {
    var range: Range | undefined = new Range();
    var selection: Selection | null = null;
    if (window.getSelection && window.getSelection()?.rangeCount! > 0)
    {
      range = window.getSelection()?.getRangeAt(0);
      selection = window.getSelection();
    }
    else if (this.document.getSelection() && this.document.getSelection()?.rangeCount! > 0)
    {
      range = this.document.getSelection()?.getRangeAt(0);
      selection = this.document.getSelection();
    }
    this.selectedText = this.ClientSideService.GetSelectedText();
  }
  UpdateClicked()
  {
    this.postsAttachments = [];
    let allImages = this.view.nativeElement.querySelectorAll("img[data-atachId]");
    console.log(allImages);
    for (let i = 0; i < allImages.length; i++)
    {
      let img = <HTMLImageElement>allImages[i];
      let atachId = img.getAttribute("data-atachId");
      this.postsAttachments.push(Number(atachId));
    }
    this.post.title = String(this.form.get(FormControlNames.postForm.title)?.value);
    this.post.description = String(this.form.get(FormControlNames.postForm.description)?.value);
    this.post.excerpt = String(this.form.get(FormControlNames.postForm.excerpt)?.value);
    this.post.htmlContent = this.view.nativeElement.innerHTML;
    this.post.slug = String(this.slug.nativeElement.value);
    this.post.author = null;
    this.post.categories = this.selectedCategories;
    this.post.tempAttach = this.postsAttachments;
    this.post.otherSlug = this.form.get(FormControlNames.postForm.otherSlug)?.value;
    if (this.post.otherSlug === "0")
    {
      this.post.otherSlug = null;
    }
    this.store.dispatch(UpdatePOST(this.post));
  }
  DraftOrPublish(view: HTMLDivElement, draftOrPublish: string)
  {
    this.postsAttachments = [];
    let allImages = this.view.nativeElement.querySelectorAll("img[data-atachId]");
    console.log(allImages);
    for (let i = 0; i < allImages.length; i++)
    {
      let img = <HTMLImageElement>allImages[i];
      let atachId = img.getAttribute("data-atachId");
      this.postsAttachments.push(Number(atachId));
    }
    this.form.get(FormControlNames.postForm.htmlContent)?.setValue(view.innerHTML);
    if (draftOrPublish === "Draft")
    {
      this.ChosenAttachment.emit(this.postsAttachments);
      this.Draft.emit(this.form);
    }
    else
    {
      this.ChosenAttachment.emit(this.postsAttachments);
      this.Publish.emit(this.form);
    }
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
    this.store.dispatch(RemovePOST({ id: this.post?.id!, url: DashboardRoutes.Posts.Home }));
  }
  BindAttachmentsToPost(Attachments: number[])
  {
    this.postsAttachments = Attachments;
  }
  isSlugUnique(slug: HTMLInputElement)
  {
    if (this.posts.length > 0)
    {
      if (this.ClientSideService.isNotUnique(this.posts, 'slug', slug.value))
        this.form.get('slug')?.setErrors({ notUnique: true });
      else
        this.form.get('slug')?.clearValidators();
    } else
      this.postService.IsSlugNotUnique(slug.value).subscribe(
        r =>
        {
          if (r)
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
  SetFeatureImage(event: Attachments | null)
  {
    if (event)
    {
      let editedUrl = event.fileUrl.includes("http") ? event.fileUrl : `${this.BaseUrl}${event.fileUrl}`;
      this.post.featureImageUrl = editedUrl;
      this.form.get(FormControlNames.postForm.featureImageUrl)?.setValue(event.fileUrl);
    }
  }
  removeFeatureImage()
  {
    this.store.dispatch(SelectAttachment({ selectedFile: null }));
    this.post.featureImageUrl = "";
    this.form.get(FormControlNames.postForm.featureImageUrl)?.setValue("");
  }
  selectCategory(selectedCatId: number)
  {
    let temp: number[] = [];
    temp = [...this.selectedCategories];
    temp.includes(selectedCatId)
      ? temp.splice(temp.indexOf(selectedCatId), 1)
      : temp.push(selectedCatId);
    this.selectedCategories = temp;
    this.form.get(FormControlNames.postForm.categories)?.setValue(this.selectedCategories);
  }
  SelectTranslation()
  {
    let tree = new TreeDataStructureService<Category>();
    tree.setData(this.AllCategories.filter(x => x.isArabic
      === Boolean(this.form.get(FormControlNames.postForm.isArabic)?.value)));
    this.CategoriesByLang = tree.finalFlatenArray();
    this.selectedTranslation = this.posts.filter(x => x.isArabic
      !== Boolean(this.form.get(FormControlNames.postForm.isArabic)?.value));
    if (this.post.otherSlug === null)
      this.form.get(FormControlNames.postForm.otherSlug)?.setValue("0");
    else
      this.form.get(FormControlNames.postForm.otherSlug)?.setValue(this.post.otherSlug);
  }
  setIsArabic(formControlName: string)
  {
    let isArabic = ArabicRegex.test(this.form.get(formControlName)?.value);
    this.ClientSideService.setIsArabic(isArabic, this.post.isArabic,
      this.post, this.form, this.postType, "post");
    this.SelectTranslation();
    if (this.Type === PostType.Add)
      this.ClientSideService.inputRedirection(isArabic);
    else
    {
      this.ClientSideService.inputRedirection(this.post.isArabic);
    }
  }
  GoToTranslatedPost()
  {
    this.store.select(selectPostBySlug(this.post.otherSlug!)).subscribe(p =>
    {
      if (p)
      {
        this.router.navigate(['', DashboardRoutes.Home,
          DashboardRoutes.Posts.Home, DashboardRoutes.Posts.EditPost],
          { queryParams: { id: p.id } });
      }
    });
  }
}
