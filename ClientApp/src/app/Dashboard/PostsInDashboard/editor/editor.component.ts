import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BaseUrl, FormControlNames, FormValidationErrors, FormValidationErrorsNames, PostStatus, sweetAlert, validators } from 'src/Helpers/constants';
import { SelectedTextData } from 'src/Interfaces/interfaces';
import { Attachments, Post, PostAttachments } from 'src/models.model';
import { selectAllposts } from 'src/State/PostState/post.reducer';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { selectAllAttachment } from 'src/State/Attachments/Attachments.reducer';
import { selectPostByID } from 'src/State/PostState/post.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'src/CommonServices/notifications.service';
@Component({
  selector: 'CodingBible-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CodingBibleEditorComponent implements OnInit, OnChanges
{
  text: SelectedTextData = { Range: new Range(), text: "", start: -1, end: -1, anchorNode: null, focusNode: null };;
  textToReplaceWith: string = "";
  textToReplace: string = "";
  textToTag: { text: string, needTag: boolean; }[] = [];
  anchorNodeText: string = "";
  anchorNode_OuterHtml: string = "";
  anchorNode_StartTag: string = "";
  anchorNode_EndTag: string = "";
  focusNodeText: string = "";
  focusNode_OuterHtml: string = "";
  focusNode_StartTag: string = "";
  focusNode_EndTag: string = "";
  focusNodeIndex: number = -1;
  anchorNodeIndex: number = -1;
  anchorNode: ChildNode | null = null;
  focusNode: ChildNode | null = null;
  NodesBetween_AnchorNode_and_FocusNode: string = "";
  NodesBetween_AnchorNode_and_FocusNode_List: ChildNode[] = [];
  treatTextToTagElementsIndependentily: boolean = false;
  tag: string = "";
  currentPost: Post = new Post();
  posts$ = this.store.select(selectAllposts);
  @Input() selectedText: SelectedTextData = { Range: new Range(), text: "", start: -1, end: -1, anchorNode: null, focusNode: null };
  @Input() view!: HTMLDivElement;
  @Input() html!: HTMLTextAreaElement;
  @Output() bindAttachmentsToPost: EventEmitter<PostAttachments[]> = new EventEmitter<PostAttachments[]>();
  allPostst: Post[] = [];
  allPostsWithOutFiltering: Post[] = [];
  filteredPosts: Post[] = [];
  selectedPost: Post | null = null;
  focusedAnchorTag: string = "";
  linkTag_Parts: { href: string, text: string, target?: boolean; } = { href: "", text: "" };
  LinkTagForm: FormGroup = new FormGroup({});
  ImageForm: FormGroup = new FormGroup({});
  VedioForm: FormGroup = new FormGroup({});
  selectedImage: HTMLImageElement | null = null;
  selected_Vedio: HTMLIFrameElement | null = null;
  widthChangeFormControl: FormControl = new FormControl(1);
  Attachments = this.store.select(selectAllAttachment);
  allAttachments: Attachments[] = [];
  postId: number = 0;
  BaseUrl = BaseUrl;
  postsAttachments: PostAttachments[] = [];
  @ViewChild("anchorTagHandling") anchorTagHandling!: ElementRef<HTMLDivElement>;
  @ViewChild("ImageTagHandling") ImageTagHandling!: ElementRef<HTMLDivElement>;
  @ViewChild("anchorTagHandling_FilledAnchor") anchorTagHandling_FilledAnchor!: ElementRef<HTMLDivElement>;
  @ViewChild("searchBoxForUrl") searchBoxForUrl!: ElementRef<HTMLInputElement>;
  @ViewChild("VedioTagHandling") VedioTagHandling!: ElementRef<HTMLInputElement>;
  widthOfVedio: FormControl = new FormControl(1);
  FormValidationErrorsNames = FormValidationErrorsNames;
  errorState = new BootstrapErrorStateMatcher();
  FormControlNames = FormControlNames;
  FormValidationErrors = FormValidationErrors;
  /**********************************************************************
   *                            Constructor.
   *********************************************************************/
  constructor(@Inject(DOCUMENT) private document: Document, private router: ActivatedRoute,
    private fb: FormBuilder, private store: Store, private Notifications: NotificationsService) { }
  /**********************************************************************
   *                            ngOnChanges.
   *********************************************************************/
  ngOnChanges(changes: SimpleChanges): void
  {
    if ('selectedText' in changes)
    {
      this.text = this.selectedText;
    }
    //attach click event to all images
    let images = this.view.getElementsByTagName("img");
    console.log(images);

    if (images.length > 0)
      for (let i = 0; i < images.length; i++)
      {
        images[i].addEventListener("click", (e) =>
        {
          if (images[i])
            if (images[i].parentElement?.nodeName.toLowerCase() === "figure")
            {
              this.widthChangeFormControl.setValue(images[i].parentElement?.style.width);
              this.ImageForm.get('width')?.setValue(Number(images[i].parentElement?.style.width.replace("%", "")));
              this.ImageForm.get("caption")?.setValue(images[i].parentElement?.getElementsByTagName("figcaption")[0].innerText);
            }
            else
            {
              this.widthChangeFormControl.setValue(images[i].getAttribute("width"));
              this.ImageForm.get('width')?.setValue(Number(images[i].getAttribute("width")?.replace("%", "")));
            }
          this.selectedImage = images[i];
          this.ImageForm.get('src')?.setValue(this.selectedImage.src);
          this.ImageForm.get('alt')?.setValue(this.selectedImage.alt);
          this.ImageForm.markAllAsTouched();
          this.anchorTagHandling.nativeElement.setAttribute("class", "d-none");
          this.anchorTagHandling_FilledAnchor.nativeElement.setAttribute("class", "d-none");
          this.VedioTagHandling.nativeElement.setAttribute("class", "d-none");
          this.hideDivElement(this.ImageTagHandling);
        });
      }
    window.focus();
    window.addEventListener("blur", () =>
    {
      if (this.document.activeElement?.nodeName.toLowerCase() === "iframe")
      {
        this.selected_Vedio = <HTMLIFrameElement>this.document.activeElement;
        this.VedioForm.get('src')?.setValue(this.selected_Vedio.src);
        this.VedioForm.get('width')?.setValue(Number(this.selected_Vedio?.parentElement?.style.width.replace("%", "")));
        this.widthOfVedio.setValue(Number(this.selected_Vedio.parentElement?.style.width.replace("%", "")));
        this.VedioTagHandling.nativeElement.setAttribute("class", 'd-block');
        this.anchorTagHandling.nativeElement.setAttribute("class", "d-none");
        this.anchorTagHandling_FilledAnchor.nativeElement.setAttribute("class", "d-none");
        this.ImageTagHandling.nativeElement.setAttribute("class", "d-none");
      }
    });
  }
  /**********************************************************************
  *                            ngOnInit
  *********************************************************************/
  ngOnInit(): void
  {
    this.Attachments.subscribe(attachments => { this.allAttachments = attachments; });
    this.router.queryParams.subscribe(x =>
    {
      if (x['id'])
      {
        this.postId = Number(x['id']);
      }
    });
    this.store.select(selectPostByID(this.postId)).subscribe(post =>
    {
      this.currentPost = post!;
      this.postsAttachments = [];
      for (let i = 0; i < post?.attachments.length!; i++)
      {
        let temp: PostAttachments = new PostAttachments();
        temp.postId = post?.id!;
        temp.attachmentId = post?.attachments[i]?.attachmentId!;
        temp.attachment = null;
        temp.post = null;
        this.postsAttachments.push(temp);
      }
    });
    this.ImageForm = this.fb.group({
      src: ['', [validators.required, validators.URL]],
      alt: ['', [validators.required]],
      width: [100, [validators.required]],
      caption: [''],
    });
    this.VedioForm = this.fb.group({
      src: ['', [validators.required, validators.YoutubeVideo]],
      width: [100, [validators.required]],
    });
    this.LinkTagForm = this.fb.group({
      href: ['', [validators.required]],
      text: ['', [validators.required]],
      target: [false]
    });
    this.view.addEventListener("click", (e) =>
    {
      this.prepare_AnchorNode_and_FocusNode();
      if (this.anchorNode_StartTag.includes("<a "))
      {
        this.focusedAnchorTag = this.anchorNode_StartTag;
        this.linkTag_Parts.href = this.anchorNode_StartTag.split("href=")[1].split(" ")[0].replace(/"/g, "").replace(/'/g, "").replace(/>/g, "");
        this.linkTag_Parts.text = this.anchorNodeText;
        this.linkTag_Parts.target = this.anchorNode_StartTag.includes("target=");

        this.LinkTagForm.get("href")?.setValue(this.linkTag_Parts.href);
        this.LinkTagForm.get("text")?.setValue(this.linkTag_Parts.text);
        this.LinkTagForm.get("target")?.setValue(this.linkTag_Parts.target);
        this.anchorTagHandling.nativeElement.setAttribute("class", "d-none");
        this.ImageTagHandling.nativeElement.setAttribute("class", "d-none");
        this.VedioTagHandling.nativeElement.setAttribute("class", "d-none");
        this.hideDivElement(this.anchorTagHandling_FilledAnchor);
      } else
        if (this.anchorTagHandling.nativeElement.classList.contains("d-block")
          || this.anchorTagHandling_FilledAnchor.nativeElement.classList.contains("d-block"))
        {
          this.anchorTagHandling.nativeElement.setAttribute("class", "d-none");
          this.anchorTagHandling_FilledAnchor.nativeElement.setAttribute("class", "d-none");

          this.searchBoxForUrl.nativeElement.value = "";
        } else
        {
          // if (this.ImageTagHandling.nativeElement.classList.contains("d-block"))
          // {
          //   this.ImageTagHandling.nativeElement.setAttribute("class", "d-none");
          // }
        }

    });
    this.posts$.subscribe(posts =>
    {
      this.allPostst = posts.filter(post => post.status === PostStatus.Published);
      this.filteredPosts = [...this.allPostst];
    });
  }
  /**********************************************************************************
   *                               Inserting Video Handling
   **********************************************************************************/
  AddNewVedio()
  {
    let vedioLink = this.VedioForm.get('src')?.value;
    let vedioId;
    if (vedioLink.includes('youtu.be'))
    {
      vedioId = vedioLink.split('youtu.be');
    }
    else if (vedioLink.includes('list='))
    {
      let link = vedioLink.split('&list=')[0];
      vedioId = link.split("youtube.com/watch?v=");
    }
    else
      vedioId = vedioLink.split("youtube.com/watch?v=");
    vedioId = vedioId[vedioId.length - 1];
    this.prepare_AnchorNode_and_FocusNode();
    this.Add_vedio_toView(vedioId, this.VedioForm.get('width')?.value);
    let vedio = this.view.querySelector(`[id="${vedioId}"]`);
    vedio?.addEventListener("click", (e) =>
    {
      this.selected_Vedio = <HTMLIFrameElement>vedio;
      this.VedioForm.get('src')?.setValue((<HTMLIFrameElement>vedio).src);
      this.VedioForm.get('width')?.setValue(Number(vedio?.parentElement?.style.width.replace("%", "")));
    });

  }
  editVedio()
  {
    let vedioLink = this.VedioForm.get('src')?.value;
    let vedioId;
    if (vedioLink.includes('youtu.be'))
    {
      vedioId = vedioLink.split('youtu.be');
    }
    else
      vedioId = vedioLink.split("youtube.com/watch?v=");
    vedioId = vedioId[vedioId.length - 1];
    this.widthOfVedio.setValue(this.VedioForm.get('width')?.value);
    (<HTMLIFrameElement>this.selected_Vedio?.parentElement).style.width = `${this.widthOfVedio.value}%`;
    this.selected_Vedio?.setAttribute("src", `https://www.youtube.com/embed/${vedioId}`);
    this.selected_Vedio?.parentElement?.setAttribute("id", `${vedioId}`);
    this.selected_Vedio?.parentElement?.setAttribute("data-source", `${vedioLink}`);
    this.UpdateHtml();
  }
  changeVideoALignment(alignmentType: string)
  {
    let classList = this.removeAlignments(this.selected_Vedio?.parentElement?.getAttribute("class")!);
    classList?.push(`align-${alignmentType}`);
    this.selected_Vedio?.parentElement?.setAttribute("class", classList.join(" "));
    this.UpdateHtml();
  }
  removeVedioAlignment()
  {
    let classList = this.removeAlignments(this.selected_Vedio?.parentElement?.getAttribute("class")!);
    this.selected_Vedio?.parentElement?.setAttribute("class", classList.join(" "));
    this.UpdateHtml();
  }
  deleteVedio()
  {
    this.selected_Vedio?.parentElement?.remove();
    this.UpdateHtml();
    this.VedioTagHandling.nativeElement.setAttribute("class", "d-none");
  }
  changeVedioSize(width: string)
  {
    console.log(width);
    this.VedioForm.get('width')?.setValue(Number(width));
    (<HTMLDivElement>this.selected_Vedio?.parentElement).style.width = `${width}%`;
    this.UpdateHtml();
  }
  /**********************************************************************************
   *                               Inserting Image Handling
   **********************************************************************************/
  selectImage(event: Attachments | null)
  {
    if (event)
    {
      let findInDom = this.view.querySelector("[src='" + event.fileUrl + "']");
      if (findInDom !== null)
      {
        this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, "You added this image before");
        return;
      }
      console.log(this.postsAttachments.find(x => x.postId === this.postId && x.attachmentId === event.id));
      if (!this.postsAttachments.find(x => x.postId === this.postId && x.attachmentId === event.id))
      {
        let temp: PostAttachments = new PostAttachments();
        temp.postId = this.postId;
        temp.attachmentId = event.id;
        temp.attachment = null;
        temp.post = null;
        this.postsAttachments.push(<PostAttachments>temp);
      }
      this.prepare_AnchorNode_and_FocusNode();
      this.add_Image_ToView(event.fileName, event.fileUrl, event.altText, event.caption);
      this.bindAttachmentsToPost.emit(this.postsAttachments);
    }
  }
  changeImageAligment(alignmentType: string)
  {
    let image = this.view.querySelector(`[src="${this.selectedImage?.getAttribute("src")}"]`);
    if (image?.parentElement?.nodeName.toLowerCase() === "figure")
    {
      let classList = this.removeAlignments(image.parentElement.getAttribute("class")!);
      classList?.push(`align-${alignmentType}`);
      image.parentElement.setAttribute("class", classList.join(" "));
    }
    else
    {
      let classList = this.removeAlignments(this.selectedImage?.getAttribute("class")!);
      classList?.push(`align-${alignmentType}`);
      image?.setAttribute("class", classList?.join(" ")!);
    }
    this.UpdateHtml();
  }
  deleteImage()
  {
    let image = this.view.querySelector(`[src="${this.selectedImage?.getAttribute("src")}"]`);
    let attachment = this.allAttachments.filter(attachment => attachment.fileUrl === image?.getAttribute("src"))[0];
    if (image?.parentElement?.nodeName.toLowerCase() === "figure")
      image.parentElement.remove();
    else
      image?.remove();
    this.UpdateHtml();
    this.ImageTagHandling.nativeElement.setAttribute("class", "d-none");
    this.selectedImage = null;
    this.postsAttachments = this.postsAttachments.filter(x => x.attachmentId !== attachment.id &&
      x.postId === this.postId);
    this.bindAttachmentsToPost.emit(this.postsAttachments);
  }
  removeImageAlignment()
  {
    let image = this.view.querySelector(`[src="${this.selectedImage?.getAttribute("src")}"]`);
    if (image?.parentElement?.nodeName.toLowerCase() === "figure")
    {
      let classList = this.removeAlignments(image.parentElement.getAttribute("class")!);
      image.parentElement.setAttribute("class", classList.join(" "));
    } else
    {
      let classList = this.removeAlignments(this.selectedImage?.getAttribute("class")!);
      image?.setAttribute("class", classList?.join(" ")!);
    }
    this.UpdateHtml();
  }
  changeImageSize(width: string)
  {
    this.ImageForm.get("width")?.setValue(Number(width));
    let image = <HTMLImageElement>this.view.querySelector(`[src="${this.selectedImage?.getAttribute("src")}"]`);
    if (image?.parentElement?.nodeName.toLowerCase() === "figure")
    {
      image.parentElement.style.width = width + "%";
      let classList = image.parentElement.getAttribute("class")!.split(" ");
      classList = classList.filter(className => className !== 'w-100');
      image.parentElement.setAttribute("class", classList.join(" "));
    }
    else
    {
      image?.setAttribute("width", width + "%");
    }
    this.UpdateHtml();
  }
  AddNewImage()
  {
    this.prepare_AnchorNode_and_FocusNode();
    this.add_Image_ToView("", this.ImageForm.get("src")?.value,
      this.ImageForm.get("alt")?.value,
      this.ImageForm.get("caption")?.value, this.ImageForm.get("width")?.value);
    this.ImageForm.reset();
  }
  editImage()
  {
    let image = this.view.querySelector(`[src="${this.selectedImage?.getAttribute("src")}"]`);
    this.widthChangeFormControl.setValue(image?.getAttribute("width"));
    image?.setAttribute("alt", this.ImageForm.get("alt")?.value);
    image?.setAttribute("src", this.ImageForm.get("src")?.value);
    if (image?.parentElement?.nodeName.toLowerCase() === "figure")
    {
      (<HTMLElement>image?.parentElement?.getElementsByTagName("figcaption")[0]).innerText = this.ImageForm.get("caption")?.value;
      image.parentElement.style.width = this.ImageForm.get("width")?.value + "%";
    } else if (image?.parentElement?.nodeName.toLowerCase() !== "figure" && this.ImageForm.get("caption")?.value !== '')
    {
      image?.setAttribute("width", "100%");
      let figureWithCaption = `<figure class="figure align-center" style="width:${this.ImageForm.get("width")?.value}%">
      ${image?.outerHTML}
      <figcaption class="figure-caption text-center">${this.ImageForm.get("caption")?.value}</figcaption>
    </figure>`;
      image?.insertAdjacentHTML("beforebegin", figureWithCaption);
      image?.remove();
    } else if (image?.parentElement?.nodeName.toLowerCase() === "figure" && this.ImageForm.get("caption")?.value === '')
    {
      let imageCopy = image.cloneNode(true);
      (<HTMLImageElement>imageCopy).setAttribute("width", this.ImageForm.get("width")?.value + "%");
      (<HTMLImageElement>imageCopy).setAttribute("src", this.ImageForm.get("src")?.value + "%");
      (<HTMLImageElement>imageCopy).setAttribute("alt", this.ImageForm.get("alt")?.value + "%");
      image.parentElement.replaceWith(imageCopy);
    }
    else
      image?.setAttribute("width", this.ImageForm.get("width")?.value + '%');
    this.UpdateHtml();
  }
  removeCaption()
  {
    let image = this.view.querySelector(`[src="${this.selectedImage?.getAttribute("src")}"]`);
    let imageCopy = image?.cloneNode(true);
    (<HTMLImageElement>imageCopy).setAttribute("width", image?.parentElement?.style.width!);
    image?.parentElement?.replaceWith(imageCopy!);
    this.ImageForm.get("caption")?.setValue("");
    this.UpdateHtml();
  }
  /**********************************************************************************
   *                               Link handling
   **********************************************************************************/
  openLinkDialog()
  {
    if (this.anchorNode !== null)
      this.hideDivElement(this.anchorTagHandling);
  }
  searchPosts(value: string)
  {
    this.filteredPosts = this.allPostst.filter(post =>
    {
      return post.title.toLowerCase().includes(value.toLowerCase()) && post.status === PostStatus.Published;
    });
  }
  AddLink(href: string)
  {
    if (href !== "")
    {
      this.buildTextToReplace_And_TextToReplaceWith();
      this.addRemoveTag(`a href='${href}'`);
    }
  }
  addNewLink()
  {
    this.prepare_AnchorNode_and_FocusNode();
    let target = this.LinkTagForm.get("target")?.value;

    let link = `<a href='${this.LinkTagForm.get("href")?.value}'`;
    if (target)
    {
      link += ` target='_blank'`;
    }
    link += `>${this.LinkTagForm.get("text")?.value}</a>`;
    let text = [this.anchorNodeText.slice(0, this.text.start), link, this.anchorNodeText.slice(this.text.start)].join('');
    if (this.anchorNode_OuterHtml)
      this.applyChangesToView(this.anchorNode_OuterHtml, this.anchorNode_StartTag + text + this.anchorNode_EndTag);
    else
      this.applyChangesToView(this.anchorNodeText, text);
  }
  editLink()
  {
    this.anchorTagHandling_FilledAnchor.nativeElement.setAttribute("class", "d-none");

    let target = this.LinkTagForm.get("target")?.value;

    let link = `<a href='${this.LinkTagForm.get("href")?.value}'`;
    if (target)
    {
      link += ` target='_blank'`;
    }
    link += `>${this.LinkTagForm.get("text")?.value}</a>`;
    this.applyChangesToView(this.anchorNode_OuterHtml, link);
  }
  /**********************************************************************************
   *                               SetHeaders
   **********************************************************************************/
  SetHeader(header: HTMLSelectElement)
  {
    let headers = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (this.selectedText.text === '' && !this.view && !this.html) return;
    this.tag = header.value;
    this.buildTextToReplace_And_TextToReplaceWith();
    if (this.matchStartTag(this.textToReplace, header.value) && this.matchEndTag(this.textToReplace, header.value))
    {
      this.removeTag(header.value);
    }
    else
    {
      let isHeaderFound = false;
      for (let h of headers)
      {
        let startTag = this.matchStartTag(this.textToReplace, h);
        if (startTag !== '')
        {
          this.removeTag(h);
          isHeaderFound = h === header.value;
          break;
        }
      }
      if (!isHeaderFound)
      {
        this.addRemoveTag(header.value);
      }
    }
    header.value = "";
  }
  /**********************************************************************************
   *                                      FontSize
   **********************************************************************************/
  setFontSize(fontSize: HTMLSelectElement)
  {
    let sizes = ['fs-1', 'fs-2', 'fs-3', 'fs-4', 'fs-5', 'fs-6'];
    if (this.selectedText.text === '' && !this.view && !this.html) return;
    this.tag = "span";
    this.buildTextToReplace_And_TextToReplaceWith();
    let startTag = this.matchStartTag(this.textToReplace, "span");
    if (!startTag)
    {
      this.addRemoveClass(fontSize.value);
    }
    else
    {
      let isHeaderFound = false;
      for (let s of sizes)
      {
        let size = startTag.match(s);
        if (size)
        {
          this.removeClass(size[0]);
          isHeaderFound = s === fontSize.value;
          break;
        }
      }
      if (!isHeaderFound)
      {
        this.addRemoveClass(fontSize.value);
      }
    }
    fontSize.value = "";
  }
  /**********************************************************************************
   *                                      Strike through
   **********************************************************************************/
  ApplyStyleBy_Class(className: string)
  {
    if (this.selectedText.text === '' && !this.view && !this.html) return;
    this.tag = "span";
    this.buildTextToReplace_And_TextToReplaceWith();
    this.addRemoveClass(className);
  }
  /**********************************************************************************
   *                                      Text Alignments
   **********************************************************************************/
  textAlignments(className: string)
  {
    let alignments = ['text-start', 'text-center', 'text-end', "text_justify-left", 'text_justify-right', 'text-justify',
    ];
    this.buildTextToReplace_And_TextToReplaceWith();
    let isHeaderFound = false;

    for (let align of alignments)
    {
      if (this.textToReplace.includes(align))
      {
        this.removeTag(`p`);
        isHeaderFound = className === align;
      }
    }
    if (!isHeaderFound)
      this.addRemoveTag(`p class="${className}"`);
  }

  /**********************************************************************************
  *                                      Remove styles
  **********************************************************************************/
  RemoveAllStyles()
  {
    this.buildTextToReplace_And_TextToReplaceWith();
    this.textToReplaceWith = this.textToReplace.replace(/<[^\/]("[^"]*"|'[^']*'|[^'">])*>|<\/[a-zA-Z0-9]+>/gi, '');
    this.applyChangesToView(this.textToReplace, this.textToReplaceWith);
  }
  AddParagraph()
  {
    this.view.innerHTML = this.view.innerHTML + "<p>Insert text here</p>";
  }
  /**********************************************************************************
  *                               Add remove tags
  **********************************************************************************/
  ApplyStyleByTag(tag: string)
  {
    this.tag = tag;
    this.buildTextToReplace_And_TextToReplaceWith();
    this.addRemoveTag(tag);
  }

  /*******************************************************************************************
   *                                   Main Functions functions
  ****************************************************************************************** */
  private buildTextToReplace(anchorNode: ChildNode | null, focusNode: ChildNode | null)
  {
    //if the anchorNode parentElement is not the same as the focusNode parentElement, this means anchorNode and focusNode
    // do inside the same node or they have different parents
    if (this.anchorNode?.parentElement !== this.focusNode?.parentElement)
    {
      this.textToTag = [
        { text: this.anchorNode?.nodeName !== "#text" ? this.anchorNode_OuterHtml : this.anchorNodeText, needTag: true },
        { text: this.focusNode?.nodeName !== "#text" ? this.focusNode_OuterHtml : this.focusNodeText, needTag: true }
      ];
      //because they have different parents, we need to tag each node independently without concatenating their content
      this.treatTextToTagElementsIndependentily = true;
    } else
    {
      //if they have the same parent
      this.treatTextToTagElementsIndependentily = false;
      if (anchorNode?.nodeName === '#text' && focusNode?.nodeName !== '#text')
      {
        this.focusNode_OuterHtml = (<HTMLElement>focusNode)?.outerHTML;
        this.focusNode_StartTag = this.getTheFirstTag(this.focusNode_OuterHtml);
        this.focusNode_EndTag = this.getTheEndTag(this.focusNode_OuterHtml);
        if (this.text.end !== focusNode?.textContent!.length!)
        {
          this.textToReplace = this.anchorNodeText! + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_StartTag + this.focusNodeText;
          this.textToTag = this.NodesBetween_AnchorNode_and_FocusNode === "" ?
            [{ text: this.anchorNodeText, needTag: true }, { text: this.focusNode_StartTag, needTag: false }, { text: this.focusNodeText, needTag: true }]
            : [{ text: this.anchorNodeText, needTag: true }, { text: this.NodesBetween_AnchorNode_and_FocusNode, needTag: true }, { text: this.focusNode_StartTag, needTag: false }, { text: this.focusNodeText, needTag: true }];

        } else 
        {
          this.textToReplace = this.anchorNodeText! + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_OuterHtml;
          this.textToTag = this.NodesBetween_AnchorNode_and_FocusNode === "" ?
            [{ text: this.anchorNodeText + this.focusNode_OuterHtml, needTag: true }] :
            [{ text: this.anchorNodeText + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_OuterHtml, needTag: true }];
        }
      }
      else if (anchorNode?.nodeName !== '#text' && focusNode?.nodeName === '#text')
      {
        this.anchorNode_OuterHtml = (<HTMLElement>anchorNode)?.outerHTML;
        this.anchorNode_StartTag = this.getTheFirstTag(this.anchorNode_OuterHtml);
        this.anchorNode_EndTag = this.getTheEndTag(this.anchorNode_OuterHtml);
        if (this.text.start !== 0 &&
          (this.text.end !== focusNode?.textContent!.length! || this.text.end === focusNode?.textContent!.length!))
        {
          this.textToReplace = this.anchorNodeText + this.anchorNode_EndTag + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNodeText;
          this.textToTag = this.NodesBetween_AnchorNode_and_FocusNode === "" ?
            [{ text: this.anchorNodeText, needTag: true }, { text: this.anchorNode_EndTag, needTag: false }, { text: this.focusNodeText, needTag: true }]
            : [{ text: this.anchorNodeText, needTag: true }, { text: this.anchorNode_EndTag, needTag: false }, { text: this.NodesBetween_AnchorNode_and_FocusNode + this.focusNodeText, needTag: true }];
        } else if (this.text.start === 0 && (this.text.end !== focusNode?.textContent!.length! || this.text.end === focusNode?.textContent!.length!))
        {
          this.textToReplace = this.anchorNode_OuterHtml + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNodeText;
          this.textToTag = [{ text: this.textToReplace, needTag: true }];
        }
      }
      else if (anchorNode?.nodeName !== '#text' && focusNode?.nodeName !== '#text')
      {
        if (this.text.start !== 0 && this.text.end !== focusNode?.textContent!.length!)
        {
          this.textToReplace = this.anchorNodeText + this.anchorNode_EndTag + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_StartTag + this.focusNodeText;
          this.textToTag = this.NodesBetween_AnchorNode_and_FocusNode === "" ?
            [{ text: this.anchorNodeText, needTag: true }, { text: this.anchorNode_EndTag, needTag: false }, { text: this.focusNode_StartTag, needTag: false }, { text: this.focusNodeText, needTag: true }]
            : [{ text: this.anchorNodeText, needTag: true }, { text: this.anchorNode_EndTag, needTag: false }, { text: this.NodesBetween_AnchorNode_and_FocusNode, needTag: true }, { text: this.focusNode_StartTag, needTag: false }, { text: this.focusNodeText, needTag: true }];
        }
        else if (this.text.start === 0 && this.text.end !== focusNode?.textContent!.length!)
        {
          this.textToReplace = this.anchorNode_OuterHtml + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_StartTag + this.focusNodeText;
          this.textToTag = this.NodesBetween_AnchorNode_and_FocusNode === "" ?
            [{ text: this.anchorNode_OuterHtml, needTag: true }, { text: this.focusNode_StartTag, needTag: false }, { text: this.focusNodeText, needTag: true }]
            : [{ text: this.anchorNode_OuterHtml + this.NodesBetween_AnchorNode_and_FocusNode, needTag: true }, { text: this.focusNode_StartTag, needTag: false }, { text: this.focusNodeText, needTag: true }];
        }
        else if (this.text.start !== 0 && this.text.end === focusNode?.textContent!.length!)
        {
          this.textToReplace = this.anchorNodeText + this.anchorNode_EndTag + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_StartTag + this.focusNodeText + this.focusNode_EndTag;
          this.textToTag = this.NodesBetween_AnchorNode_and_FocusNode === "" ?
            [{ text: this.anchorNodeText, needTag: true }, { text: this.anchorNode_EndTag, needTag: false }, { text: this.focusNode_OuterHtml, needTag: true }]
            : [{ text: this.anchorNodeText, needTag: true }, { text: this.anchorNode_EndTag, needTag: false }, { text: this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_OuterHtml, needTag: true }];
        }
        else if (this.text.start === 0 && this.text.end === focusNode?.textContent!.length!)
        {
          this.textToReplace = this.anchorNode_OuterHtml + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_OuterHtml;
          this.textToTag = [{ text: this.textToReplace, needTag: true }];
        }
      } else
      {
        this.textToReplace = this.anchorNodeText + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNodeText;
        this.textToTag = [{ text: this.textToReplace, needTag: true }];
      }
    }
  }
  private buildTextToReplace_And_TextToReplaceWith()
  {
    this.checkIfSelectionFromLeftToRight(this.text.anchorNode?.textContent, this.text.focusNode?.textContent);

    this.text = this.selectedText;
    this.prepare_AnchorNode_and_FocusNode();

    //if the whole selected text is inside one node, the anchorNode and focusNode are the same
    if (this.text.anchorNode?.isEqualNode(this.text.focusNode!)
      || this.anchorNode !== null && this.focusNode === null || this.anchorNode?.isEqualNode(this.focusNode))
    {
      //if we just clicked inside the node, the selected text is empty and we will select the whole text inside the node
      if (this.text.text === '')
      {
        if (this.anchorNode?.nodeName === '#text')
        {
          this.textToReplace = this.anchorNode.textContent!;
          this.textToTag = [{ text: this.textToReplace, needTag: true }];
        } else
        {
          this.textToReplace = (<HTMLElement>this.anchorNode).outerHTML!;
          this.textToTag = [{ text: this.textToReplace, needTag: true }];
        }
      }
      //if we select the start and end of the text.
      else
      {
        this.anchorNodeText = this.focusNode !== null && this.text.text !== "" ? this.anchorNode?.textContent?.substring(this.text.start, this.text.end)! :
          this.anchorNode?.textContent!;
        if (this.anchorNode?.nodeName === '#text')
        {
          let startIndex = this.view.innerHTML.indexOf(this.anchorNode.textContent!) + this.text.start;
          let textBeforeTextToUpdate = this.view.innerHTML.substring(0, startIndex);
          let textToUpdate = this.anchorNodeText;
          let textAfterTextToUpdate = this.view.innerHTML.substring(startIndex + textToUpdate.length);
          this.textToReplace = textBeforeTextToUpdate + textToUpdate + textAfterTextToUpdate;
          this.textToTag = [{ text: textBeforeTextToUpdate, needTag: false }, { text: textToUpdate, needTag: true }, { text: textAfterTextToUpdate, needTag: false }];
        }
        else
        {
          //if we select part of the text of the anchorNode
          if (this.text.anchorNode?.textContent === this.anchorNodeText)
          {
            let startIndex = this.view.innerHTML.indexOf(this.anchorNode_OuterHtml);
            let textBeforeTextToUpdate = this.view.innerHTML.substring(0, startIndex);
            let textToUpdate = this.anchorNode_OuterHtml;
            let textAfterTextToUpdate = this.view.innerHTML.substring(startIndex + this.anchorNode_OuterHtml.length);

            this.textToReplace = textBeforeTextToUpdate + textToUpdate + textAfterTextToUpdate;
            this.textToTag = [{ text: textBeforeTextToUpdate, needTag: false }, { text: this.textToReplace, needTag: true }, { text: textAfterTextToUpdate, needTag: false }];
          } else
          {
            //If we select the whole text text inside the anchorNode
            let startIndex = this.view.innerHTML.indexOf(this.anchorNode_StartTag + this.anchorNode?.textContent?.substring(0, this.text.start)) + this.anchorNode_StartTag.length;
            let textBeforeTextToUpdate = this.view.innerHTML.substring(0, startIndex);
            let textToUpdate = this.anchorNodeText;
            let textAfterTextToUpdate = this.view.innerHTML.substring(startIndex + textToUpdate.length);
            this.textToReplace = textBeforeTextToUpdate + textToUpdate + textAfterTextToUpdate;
            this.textToTag = [{ text: textBeforeTextToUpdate, needTag: false }, { text: this.textToReplace, needTag: true }, { text: textAfterTextToUpdate, needTag: false }];
          }
        }
      }
    }
    //if the selected text spread over multiple nodes
    else
    {
      this.anchorNodeText = this.anchorNode?.textContent?.substring(this.text.start)!;

      this.focusNodeText = this.focusNode?.textContent?.substring(0, this.text.end)!;
      //if the selected text is over 2 direct neighbors nodes
      if (this.anchorNode?.nextSibling === this.focusNode)
      {
        this.NodesBetween_AnchorNode_and_FocusNode = "";
        this.buildTextToReplace(this.anchorNode, this.focusNode);
      } else
      //if the 2 nodes are not direct neighbors
      {
        if (this.text.documentFragment?.childNodes.length! > 2)
          for (let i = 1; i < this.text.documentFragment?.childNodes.length! - 1; i++)
          {
            this.NodesBetween_AnchorNode_and_FocusNode += (<HTMLElement>this.text.documentFragment?.childNodes[i]).outerHTML;
          }
        this.buildTextToReplace(this.anchorNode, this.focusNode);
      }
    }
  }
  applyChangesToView(textToReplace: string | RegExp, textToReplaceWith: string, UpdateHtml: boolean = true)
  {
    this.view.innerHTML = this.view.innerHTML.replace(textToReplace, textToReplaceWith).replace(/<[^\/]("[^"img]*"|'[^'img]*'|[^'">img])*><\/[a-zA-Z0-9]+>/gi, "")
      .replace("&nbsp;", " ").replace("<p><br></p>", "");
    if (UpdateHtml)
      this.UpdateHtml();
  }
  addRemoveTag(tag: string)
  {
    if (this.textToTag.length === 0) return;
    if (this.treatTextToTagElementsIndependentily)
    {
      let startTag: RegExp;
      if (tag.indexOf("class") === -1)
        startTag = new RegExp(`<${tag}(\s?[^>]*)*>`);
      else
        startTag = new RegExp(`<${tag.replace(/\s?class\s?=\s?("|')[^'"><]+("|')/, '')}(\s?[^>]*)*>`);
      for (let t of this.textToTag)
      {
        if (t.needTag)
        {
          let start_of_string = t.text.substring(0, this.anchorNode_StartTag.length);
          if (start_of_string.match(startTag) === null)
          {
            let temp = `<${tag}>${t.text}</${tag}>`;
            this.applyChangesToView(t.text, temp);
          } else
          {
            let temp = this.removeLastTag(t.text.replace(startTag, ""), `</${tag}>`);
            this.applyChangesToView(t.text, temp);
          }
        }
      }
      this.treatTextToTagElementsIndependentily = false;
    } else
    {
      this.textToReplaceWith = "";
      let startTag: RegExp;
      if (tag.indexOf("class") === -1)
        startTag = new RegExp(`<${tag}(\s?[^>]*)*>`);
      else
        startTag = new RegExp(`<${tag.replace(/\s?class\s?=\s?("|')[^'"><]+("|')/, '')}(\s?[^>]*)*>`);
      for (let t of this.textToTag)
      {
        if (t.needTag)
        {
          let start_of_string = t.text.substring(0, this.anchorNode_StartTag.length);

          if (start_of_string.match(startTag) === null)
          {
            this.textToReplaceWith += `<${tag}>${t.text}</${tag}>`;
          } else
          {
            t.text = this.removeLastTag(t.text.replace(startTag, ""), `</${tag}>`);
            this.textToReplaceWith += t.text;
          }
        } else
        {
          this.textToReplaceWith += t.text;
        }
      }
      this.applyChangesToView(this.textToReplace, this.textToReplaceWith);
    }
  }
  removeTag(tag: string)
  {
    if (this.textToTag.length === 0) return;
    this.textToReplaceWith = "";
    if (this.treatTextToTagElementsIndependentily)
    {
      for (let t of this.textToTag)
      {
        if (t.needTag)
        {
          let startTag = this.matchStartTag(t.text, tag);
          let temp = this.removeLastTag(t.text.replace(startTag, ""), `</${tag}>`);
          this.applyChangesToView(t.text, temp);
        }
      }
      this.treatTextToTagElementsIndependentily = false;
    } else
    {
      for (let t of this.textToTag)
      {
        if (t.needTag)
        {
          let startTag = this.matchStartTag(t.text, tag);
          t.text = this.removeLastTag(t.text.replace(startTag, ""), `</${tag}>`);
          this.textToReplaceWith += t.text;
        } else
        {
          this.textToReplaceWith += t.text;
        }
      }
      this.applyChangesToView(this.textToReplace, this.textToReplaceWith);
    }
    this.buildTextToReplace_And_TextToReplaceWith();

  }
  UpdateHtml()
  {
    this.html.value = this.view.innerHTML;
  }
  removeClass(className: string)
  {
    if (this.textToTag.length === 0) return;
    this.textToReplaceWith = "";
    if (this.treatTextToTagElementsIndependentily)
    {
      for (let t of this.textToTag)
      {
        if (t.needTag)
        {
          let startTag = this.matchStartTag(t.text, "span");
          if (startTag != null)
          {
            let startTagWithClass = startTag.replace(className, "");
            let temp = "";
            if (startTagWithClass.match(/class=("|')\s*("|')/) !== null)
              temp = this.removeLastTag(t.text.replace(startTag, ""), `</span>`);
            else
              temp = t.text.replace(startTag, startTagWithClass);
            this.applyChangesToView(t.text, temp);
          }
        }
      }
      this.treatTextToTagElementsIndependentily = false;
    } else
    {
      for (let t of this.textToTag)
      {
        if (t.needTag)
        {
          let startTag = this.matchStartTag(t.text, "span");
          if (startTag != null)
          {
            let startTagWithClass = startTag.replace(className, "");
            if (startTagWithClass.includes(className))
            {
              t.text = t.text.replace(className, "");
              startTagWithClass.replace(className, "");
            }
            if (startTagWithClass.match(/class=("|')\s*("|')/) !== null)
              t.text = this.removeLastTag(t.text.replace(startTag, ""), `</span>`);
            else
              t.text = t.text.replace(startTag, startTagWithClass);
            this.textToReplaceWith += t.text;
          }
        } else
        {
          this.textToReplaceWith += t.text;
        }
      }
      this.applyChangesToView(this.textToReplace, this.textToReplaceWith);
      this.buildTextToReplace_And_TextToReplaceWith();
    }
  }
  addRemoveClass(className: string)
  {
    if (this.treatTextToTagElementsIndependentily)
    {
      for (let t of this.textToTag)
      {
        if (t.text === "") continue;
        if (t.needTag)
        {
          let startTag = this.matchStartTag(t.text, 'span');
          if (!startTag.includes("class="))
          {
            this.textToReplaceWith += `<span class="${className}">${t.text}</span>`;
          } else
          {
            let match = startTag.match(/class=("|')[^'"><]+("|')/gi)![0];
            let classes = match.substring('class="'.length, match.length - 1);
            let newClassList = "";
            if (classes.includes(className))
              newClassList = classes.replace(className, '');
            else
              newClassList = className + ' ' + classes;
            if (newClassList === "")
            {
              let temp = this.removeLastTag(t.text.replace(startTag, ""), `</span>`);
              this.applyChangesToView(t.text, temp);
            }
            else
            {
              let temp = t.text.replace(classes, newClassList);
              this.applyChangesToView(t.text, temp);
            }
          }
        }
        else
        {
          this.textToReplaceWith += t.text;
        }
      }
      this.applyChangesToView(this.textToReplace, this.textToReplaceWith);
    } else
    {
      for (let t of this.textToTag)
      {
        if (t.text === "") continue;
        if (t.needTag)
        {
          let startTag = this.matchStartTag(t.text, 'span');
          if (!startTag.includes("class="))
          {
            this.textToReplaceWith += `<span class="${className}">${t.text}</span>`;
          } else
          {
            let match = startTag.match(/class=("|')[^'"><]+("|')/gi)![0];
            let classes = match.substring('class="'.length, match.length - 1);
            let newClassList = "";
            if (classes.includes(className))
              newClassList = classes.replace(className, '');
            else
              newClassList = className + ' ' + classes;
            if (newClassList === "")
            {
              this.textToReplaceWith = this.removeLastTag(t.text.replace(startTag, ""), `</span>`);
            }
            else
            {
              this.textToReplaceWith += t.text.replace(classes, newClassList);
            }
          }
        }
        else
        {
          this.textToReplaceWith += t.text;
        }
      }
      this.applyChangesToView(this.textToReplace, this.textToReplaceWith);
    }

  }
  checkIfSelectionFromLeftToRight(anchorText: any, focusText: any)
  {
    let anchorIndex = this.view.innerHTML.indexOf(anchorText);
    let focusIndex = this.view.innerHTML.indexOf(focusText);
    if (anchorIndex > focusIndex)
    {
      let temp = this.text;
      this.text = {
        Range: temp.Range,
        text: temp.text,
        start: temp.end,
        end: temp.start,
        focusNode: temp.anchorNode,
        anchorNode: temp.focusNode
      };
    } else if (anchorIndex === focusIndex)
    {
      if (this.text.start < this.text.end)
      {
        let temp = this.text;
        this.text = {
          Range: temp.Range,
          text: temp.text,
          start: temp.end,
          end: temp.start,
          focusNode: temp.anchorNode,
          anchorNode: temp.focusNode
        };
      }
    }
  }
  /*******************************************************************************************
   *                                    Helper functions
  ****************************************************************************************** */
  getTheFirstTag(x: string)
  {
    return x.match(/<[^\/]("[^"]*"|'[^']*'|[^'">])*>/)![0];//get start tag only
  }
  getTheEndTag(x: string)
  {
    let match = x.match(/<\/[a-zA-Z0-9]+>/g);
    return match![match?.length! - 1];
  }
  matchEndTag(text: string, tag: string)
  {
    let re = new RegExp(`<${tag}(\s?[^>]*)*>`);
    let match = text.match(re);
    return match === null ? "" : match![match?.length! - 1];
  }
  matchStartTag(text: string, tag: string)
  {
    let re: RegExp;
    if (tag.indexOf("class") === -1)
      re = new RegExp(`<${tag}(\s?[^>]*)*>`);
    else
      re = new RegExp(`<${tag.replace(/\s?class\s?=\s?("|')[^'"><]+("|')/, '')}(\s?[^>]*)*>`);
    let match = null;
    if (text)
    {
      match = text.match(re);
    }
    return match === null ? "" : match![0];
  }
  prepare_AnchorNode_and_FocusNode()
  {
    this.focusedAnchorTag = "";
    this.anchorNode = null;
    this.anchorNodeIndex = -1;
    this.anchorNodeText = "";
    this.anchorNode_StartTag = "";
    this.anchorNode_EndTag = "";
    this.anchorNode_OuterHtml = "";
    this.focusNode = null;
    this.focusNodeIndex = -1;
    this.focusNodeText = "";
    this.focusNode_StartTag = "";
    this.focusNode_EndTag = "";
    this.focusNode_OuterHtml = "";
    this.textToReplace = "";
    this.textToReplaceWith = "";
    this.NodesBetween_AnchorNode_and_FocusNode = "";
    this.anchorNode = this.extractAnchorNode(this.view.childNodes);
    console.log(this.anchorNode);
    this.focusNode = this.extractFocusNode(this.view.childNodes);
    this.anchorNodeText = this.anchorNode?.textContent!;
    this.focusNodeText = this.focusNode?.textContent!;
    if (this.anchorNode?.nodeName !== '#text' && this.anchorNode != null)
    {
      this.anchorNode_OuterHtml = (<HTMLElement>this.anchorNode)?.outerHTML;
      this.anchorNode_StartTag = this.getTheFirstTag(this.anchorNode_OuterHtml);
      this.anchorNode_EndTag = this.getTheEndTag(this.anchorNode_OuterHtml);
    }
    if (this.focusNode?.nodeName !== '#text' && this.focusNode != null)
    {
      this.focusNode_OuterHtml = (<HTMLElement>this.focusNode)?.outerHTML;
      this.focusNode_StartTag = this.getTheFirstTag(this.focusNode_OuterHtml);
      this.focusNode_EndTag = this.getTheEndTag(this.focusNode_OuterHtml);
    }
  }
  //remove tag from last of text
  removeLastTag(text: string, tag: string, replaceOnly: boolean = false)
  {
    const lastIndexOfL = text.lastIndexOf(tag);
    let x = text.slice(0, lastIndexOfL);
    let removeLastL = "";
    if (replaceOnly)
      removeLastL = text.slice(0, lastIndexOfL) +
        text.slice(lastIndexOfL).replace(text.slice(lastIndexOfL), tag);
    else
      removeLastL = text.slice(0, lastIndexOfL);
    return removeLastL;
  }
  extractAnchorNode(nodeList: NodeListOf<ChildNode>, x: ChildNode | null = null): ChildNode | null
  {
    if (this.text.anchorNode?.nodeName === "P") return this.text.anchorNode as ChildNode;
    if (this.text.anchorNode?.isSameNode(this.view)) return this.view;
    for (let i = 0; i < nodeList.length; i++)
    {
      if (x !== null) return x;
      let start_of_string = (<HTMLElement>nodeList[i]).outerHTML ? (<HTMLElement>nodeList[i]).outerHTML.substring(0, `<${this.tag}`.length) : "";

      if (nodeList[i].isEqualNode(this.text.anchorNode!)
        || nodeList[i].isEqualNode(this.text.anchorNode?.parentElement!) && nodeList[i].nodeName !== "P"
        || this.tag !== '' && start_of_string.includes(this.tag)
        && ((<HTMLElement>nodeList[i]).innerText && (<HTMLElement>nodeList[i]).innerText.includes(this.text.anchorNode?.textContent!)))
      {
        x = nodeList[i];
        return x;
      } else
        x = this.extractAnchorNode(nodeList[i].childNodes, x);
    }
    return x;
  }
  extractFocusNode(nodeList: NodeListOf<ChildNode>, x: ChildNode | null = null): ChildNode | null
  {
    for (let i = 0; i < nodeList.length; i++)
    {
      if (x !== null) return x;
      let n = nodeList[i];
      let start_of_string = (<HTMLElement>nodeList[i]).outerHTML ? (<HTMLElement>nodeList[i]).outerHTML.substring(0, `<${this.tag}`.length) : "";

      if (nodeList[i].isEqualNode(this.text.focusNode!) ||
        nodeList[i].isEqualNode(this.text.focusNode?.parentElement!) && nodeList[i].nodeName !== "P"
        || this.tag !== '' && start_of_string.includes(this.tag)
        && ((<HTMLElement>nodeList[i]).innerText && (<HTMLElement>nodeList[i]).innerText.includes(this.text.focusNode?.textContent!)))
      {
        x = nodeList[i];
        return x;
      } else
        x = this.extractFocusNode(nodeList[i].childNodes, x);
    }
    return x;
  }
  hideDivElement(el: ElementRef<HTMLDivElement>)
  {
    let adabpted_x_Position = 0;
    // el.nativeElement.style.position = 'absolute';
    // el.nativeElement.style.zIndex = '50000';
    el.nativeElement.setAttribute("class", "d-block sticky-top");
    // el.nativeElement.style.top = `2px`;
    // el.nativeElement.style.left = `2px`;
    // this.view.style.position = 'relative';
    // this.view.appendChild(el.nativeElement);
    // if (this.text.mouseX! >= el.nativeElement.clientWidth)
    // {
    //   adabpted_x_Position = (this.text.mouseX! - el.nativeElement.clientWidth * 50 / 100);
    // }
    // else
    // {
    //   adabpted_x_Position = this.text.mouseX! - this.text.mouseX! * 50 / 100;
    // };
    // el.nativeElement.style.top = this.text.mouseY! + 20 + 'px';
    // el.nativeElement.style.left = adabpted_x_Position + 'px';
  }
  removeAlignments(classAttrinute: string)
  {
    let classList = classAttrinute.split(' ');
    return classList.filter(x => x !== 'align-center' && x !== 'align-right' && x !== 'align-left');
  }

  add_Image_ToView(fileName: string, url: string, alt: string, caption: string, width: number = 100)
  {
    let figureWithCaption = "";
    let image = `<img id="${BaseUrl}${fileName}" 
    class="figure-img img-fluid rounded align-center"
    src="${url}" alt="${alt}" width="100%">`;
    figureWithCaption = `<figure class="figure align-center" style="width:${width}%">
      ${image}
      <figcaption class="figure-caption text-center">${caption}</figcaption>
    </figure>`;
    if (caption !== null || caption !== '')
    {
      if (this.text.anchorNode?.isSameNode(this.view))
      {
        this.view.innerHTML += figureWithCaption;
        this.UpdateHtml();
      }
      else
      {
        this.anchorNode?.replaceWith(this.convertString_ToHtml(figureWithCaption).firstChild!);
        this.UpdateHtml();
      }
      // else if (this.text.anchorNode?.textContent === "Insert text here")
      // {
      //   this.applyChangesToView(this.text.anchorNode.parentElement?.outerHTML!, figureWithCaption);
      // }
      // else
      //   this.applyChangesToView(this.anchorNode_OuterHtml, figureWithCaption);
    }
    else
    {
      if (this.text.anchorNode?.isSameNode(this.view))
      {
        this.view.innerHTML += image;
        this.UpdateHtml();
      }
      else
      {
        this.anchorNode?.replaceWith(this.convertString_ToHtml(image).firstChild!);
        this.UpdateHtml();
      }
    }
    let newImage = <HTMLImageElement>this.document.getElementById(fileName);
    newImage?.addEventListener("click", () =>
    {
      this.selectedImage = newImage;
      this.hideDivElement(this.ImageTagHandling);
      this.text.documentFragment = this.document.createRange().createContextualFragment(newImage?.outerHTML!);
    });
  }
  Add_vedio_toView(vedioId: string, width: number)
  {
    let vedioInDOM = this.document.getElementById(vedioId);
    if (vedioInDOM !== null)
    {
      this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, "This vedio is already in the page");
      return;
    }
    let vedio = `<div data-source="https://www.youtube.com/embed/${vedioId}" id="${vedioId}" class="youtube-container align-center" style="width:${width}%;">
    <iframe src="https://www.youtube.com/embed/${vedioId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
    encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen></iframe>
    </div>`;

    if (this.text.anchorNode?.isSameNode(this.view))
    {
      this.view.innerHTML += vedio;
      this.UpdateHtml();
    } else
    {
      this.anchorNode?.replaceWith(this.convertString_ToHtml(vedio).firstChild!);
      this.UpdateHtml();
    }
    // this.anchorNode?.remove();
    // else if (this.text.anchorNode?.textContent === "Insert text here")
    // {
    //   this.applyChangesToView(this.text.anchorNode.parentElement?.outerHTML!, vedio);
    // }
    // else
    //   this.applyChangesToView(this.anchorNode_OuterHtml, vedio);
  }
  convertString_ToHtml(str: string)
  {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
  };
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent)
  {
    if (event.key === "ArrowDown" || event.key === "ArrowUp")
    {
      if (this.selectedPost === null)
      {
        this.selectedPost = this.filteredPosts[0];
      } else
      {
        if (event.key === "ArrowDown")
        {
          let index = this.filteredPosts.indexOf(this.selectedPost);
          if (index < this.filteredPosts.length - 1)
          {
            this.selectedPost = this.filteredPosts[index + 1];
          } else
          {
            this.selectedPost = this.filteredPosts[0];
          }
        }
        else if (event.key === "ArrowUp")
        {
          let index = this.filteredPosts.indexOf(this.selectedPost);
          if (index > 0)
          {
            this.selectedPost = this.filteredPosts[index - 1];
          } else
          {
            this.selectedPost = this.filteredPosts[this.filteredPosts.length - 1];
          }
        }
      }
    }
    if (event.key == "Enter")
    {
      this.document.execCommand('formatBlock', true, 'p');
    }
  }
}
