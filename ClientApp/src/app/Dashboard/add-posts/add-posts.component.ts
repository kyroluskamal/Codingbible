import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CardTitle, SelectedTextData } from 'src/Interfaces/interfaces';

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
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void
  {
    this.form = this.fb.group({
      content: [null]
    });
  }
  UpdateView(html: HTMLTextAreaElement, view: HTMLDivElement)
  {
    view.innerHTML = html.value;
  }

  UpdateHtml(html: HTMLTextAreaElement, view: HTMLDivElement)
  {
    html.value = view.innerHTML;

  }
  GetData()
  {
    console.log(this.form.get('content')?.value);
  }

  CreateSlug(title: HTMLInputElement, slug: HTMLInputElement)
  {
    slug.value = title.value.trim().split(' ').join("-");
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
      console.log(this.selectedText.anchorNode?.parentElement?.outerHTML);
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
}
