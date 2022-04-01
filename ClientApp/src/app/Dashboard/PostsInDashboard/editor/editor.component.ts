import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SelectedTextData } from 'src/Interfaces/interfaces';

@Component({
  selector: 'CodingBible-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class CodingBibleEditorComponent implements OnInit, OnChanges
{
  text: SelectedTextData = { text: "", start: -1, end: -1, anchorNode: null, focusNode: null };;
  finalText: string = "";
  @Input() selectedText: SelectedTextData = { text: "", start: -1, end: -1, anchorNode: null, focusNode: null };
  @Input() view!: HTMLDivElement;
  @Input() html!: HTMLTextAreaElement;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void
  {
    if ('selectedText' in changes)
    {
      this.text = this.selectedText;
    }
  }

  ngOnInit(): void
  {
  }
  /**********************************************************************************
   *                                      Bold
   **********************************************************************************/
  bold()
  {
    this.AddRemoveStyle("strong");
  }
  /**********************************************************************************
 *                                      Italic
 **********************************************************************************/
  italic() { this.AddRemoveStyle('em'); }
  /**********************************************************************************
  *                                      Underline
  **********************************************************************************/
  underline() { this.AddRemoveStyle('u'); }
  Undeline_byInsert() { this.AddRemoveStyle('ins'); }
  /**********************************************************************************
   *                                      FontSize
   **********************************************************************************/
  setFontSize(fontSize: HTMLSelectElement)
  {
    this.getTextFromRexgex();
    let sizes = ['fs-1', 'fs-2', 'fs-3', 'fs-4', 'fs-5', 'fs-6'];
    if (this.selectedText.text === '' && !this.view && !this.html) return;
    if (this.finalText.includes(fontSize.value))
    {
      this.removeClass(fontSize.value);;
    } else
    {
      for (let s of sizes)
      {
        if (this.finalText.includes(`${s}`))
        {
          this.removeClass(s);
        }
      }
      this.addClass(fontSize.value);
    }
    this.UpdateHtml();
    fontSize.value = "";
  }
  /**********************************************************************************
   *                                      Strike through
   **********************************************************************************/
  Strikethrough()
  {
    this.getTextFromRexgex();
    if (this.selectedText.text === '' && !this.view && !this.html) return;
    if (this.finalText.includes("text-decoration-line-through"))
    {
      this.removeClass("text-decoration-line-through");
    } else
    {

      this.addClass("text-decoration-line-through");
    }
    this.UpdateHtml();
  }
  Strikethrough_delTag()
  {
    this.AddRemoveStyle('del');
  }
  /**********************************************************************************
  *                                      Remove styles
  **********************************************************************************/
  RemoveAllStyles()
  {
    this.getTextFromRexgex();
    let temp = this.finalText;
    let tags = this.finalText.match(/(<(\"[^\"div\|p]*\"|'[^']*'|[^'\">])*>)/gi);
    for (let t of tags!)
      if (!t.includes("div") && !t.includes("p"))
        this.finalText = this.finalText.replace(t, '');
    this.view.innerHTML = this.view.innerHTML.replace(temp, this.finalText);
    this.UpdateHtml();
  }
  Remove_PTag()
  {
    this.getTextFromRexgex();
    let startRegex = new RegExp(`<p(\s?[^>]*)*>`, 'gi');
    let endRegex = new RegExp(`</p>`, 'gi');
    this.removeTag(startRegex, endRegex);
    this.UpdateHtml();
  }
  /**********************************************************************************
  *                               SetHeaders
  **********************************************************************************/
  SetHeader(header: HTMLSelectElement)
  {
    let startRegex = new RegExp(`<${header.value}(\s?[^>]*)*>`, 'gi');
    let endRegex = new RegExp(`</${header.value}>`, 'gi');
    this.getTextFromRexgex();
    let headers = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (this.selectedText.text === '' && !this.view && !this.html) return;
    if (this.finalText.includes(`<${header.value}`) && this.finalText.includes(`</${header.value}>`))
    {
      this.removeTag(startRegex, endRegex);
    }
    else
    {
      for (let h of headers)
      {
        if (this.finalText.includes(`<${h}>`))
        {
          let startRegex = new RegExp(`<${h}(\s?[^>]*)*>`, 'gi');
          let endRegex = new RegExp(`</${h}>`, 'gi');
          this.removeTag(startRegex, endRegex);
        }
      }
      this.addTag(header.value);
    }
    this.UpdateHtml();
    header.value = "";
  }
  /**********************************************************************************
  *                               Subscript and superscript
  **********************************************************************************/
  superScript() { this.AddRemoveStyle('sup'); }
  subScript() { this.AddRemoveStyle('sub'); }

  UpdateHtml()
  {
    this.html.value = this.view.innerHTML;
  }

  AddRemoveStyle(tag: string)
  {
    let startRegex = new RegExp(`<${tag}(\s?[^>]*)*>`, 'gi');
    let endRegex = new RegExp(`</${tag}>`, 'gi');
    this.getTextFromRexgex();
    if (this.selectedText.text === '' && !this.view && !this.html) return;
    if (this.finalText.includes(`<${tag}`) && this.finalText.includes(`</${tag}>`))
    {
      this.removeTag(startRegex, endRegex);
    } else
      this.addTag(tag);
    this.UpdateHtml();
  }

  getTextFromRexgex()
  {
    this.text = this.selectedText;
    let startIndex: number = -1;
    let endIndex: number = -1;
    // If we have only one node inside the editable div
    if (this.text.text !== '')
    {
      if (this.view.childNodes.length === 1)
      {
        // If this node is text node
        if (this.view.childNodes[0].nodeName === '#text')
        {
          this.finalText = this.view.innerHTML.substring(this.text.start, this.text.end);
        }
        //if it is not a text node 
        else
        {
          let Node = (<HTMLElement>this.view.childNodes[0]);
          let temRegex = new RegExp(`(<(\"[^\"]*\"|'[^']*'|[^'\">])*>)?\\s*${this.text.text}\\s*(<(\"[^\"]*\"|'[^']*'|[^'\">])*>)?`);
          let match = Node.outerHTML.match(temRegex);
          if (Node.innerText.length === this.text.text.length)
          {
            this.finalText = Node.outerHTML;
          }
          else if (Node.innerText.length > this.text.text.length)
          {
            if (match)
            {
              this.finalText = match[0];
            } else
              this.finalText = this.text.text;
          } else
          {

          }
        }
      }
      else if (this.view.childNodes.length > 1)
      {
        this.checkIfSelectionFromLeftToRight(this.text.anchorNode?.textContent, this.text.focusNode?.textContent);
        let anchorNode: ChildNode | null = null;
        let anchorNodeIndex: number = -1;
        let focusNodeIndex: number = -1;
        let focusNode: ChildNode | null = null;
        for (let i = 0; i < this.view.childNodes.length; i++)
        {
          if (this.view.childNodes[i].textContent?.includes(this.text.anchorNode?.textContent!))
          {
            anchorNode = this.view.childNodes[i];
            anchorNodeIndex = i;
          }
          if (this.view.childNodes[i].textContent?.includes(this.text.focusNode?.textContent!))
          {
            focusNode = this.view.childNodes[i];
            focusNodeIndex = i;
          }
          if (anchorNodeIndex > -1 && focusNodeIndex > -1) break;
        }
        if (anchorNode?.textContent!?.length < this.text.text.length)
        {
          let temp = "";
          temp = anchorNode?.nodeName === "#text" ? anchorNode.textContent!?.substring(this.text.start) :
            this.text.start === 0 ? (<HTMLElement>anchorNode).outerHTML.substring(this.text.start) :
              (<HTMLElement>anchorNode).outerHTML.substring(this.text.start + this.getTheFirstTag((<HTMLElement>anchorNode).outerHTML!)?.length!);
          if (focusNodeIndex - anchorNodeIndex > 1)
          {
            for (let i = anchorNodeIndex + 1; i < focusNodeIndex; i++)
            {
              temp += this.view.childNodes[i].nodeName === "#text" ? this.view.childNodes[i].textContent : (<HTMLElement>this.view.childNodes[i]).outerHTML;
            }
          }
          temp += focusNode?.nodeName === '#text' ? focusNode.textContent!.substring(0, this.text.end) :
            (<HTMLElement>focusNode).outerHTML.substring(0, this.text.end + this.getTheFirstTag((<HTMLElement>focusNode).outerHTML!)?.length!);
          this.finalText = temp;

        }
        else if (anchorNode?.textContent!?.length > this.text.text.length)
        {
          if (this.text.anchorNode?.textContent === this.text.focusNode?.textContent)
          {
            let temRegex = new RegExp(`(<(\"[^\"]*\"|'[^']*'|[^'\">])*>)?\\s*${this.text.text}\\s*(<(\"[^\"]*\"|'[^']*'|[^'\">])*>)?`);
            if (anchorNode?.nodeName === "#text")
            {
              this.finalText = anchorNode.textContent!?.substring(this.text.start, this.text.end); return;
            } else
            {
              let match = (<HTMLElement>anchorNode).outerHTML.match(temRegex);
              if (match)
              {
                this.finalText = match[0];
                return;
              }
            }
          }
          else
          {
            let temp = (<HTMLElement>anchorNode).innerHTML.substring((<HTMLElement>anchorNode).innerHTML.indexOf(this.text.anchorNode?.textContent!) + this.text.start,
              (<HTMLElement>focusNode).innerHTML.indexOf(this.text.focusNode?.textContent!) + this.text.end);
            let temRegex = new RegExp(`(<(\"[^\"]*\"|'[^']*'|[^'\">])*>)?\\s*${temp}\\s*(<(\"[^\"]*\"|'[^']*'|[^'\">])*>)?`);
            let match = (<HTMLElement>anchorNode).outerHTML.match(temRegex);
            if (match)
            {
              this.finalText = match[0];
              return;
            }
          }
        } else if (anchorNode?.textContent?.length === this.text.text.length)
        {
          this.finalText = anchorNode.nodeName === '#text' ? anchorNode.textContent : (<HTMLElement>anchorNode).outerHTML;
        }

      }
    } else
    {
      this.finalText = this.text.anchorNode?.parentElement!?.outerHTML;
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
          text: temp.text,
          start: temp.end,
          end: temp.start,
          focusNode: temp.anchorNode,
          anchorNode: temp.focusNode
        };
      }
    }
  }
  getTheFirstTag(x: string)
  {
    return x.match(/<("[^"]*"|'[^']*'|[^'">])*>/)![0];
  }


  removeTag(startRegex: RegExp, endRegex: RegExp)
  {
    let temp = this.finalText;
    this.finalText = this.finalText.replace(startRegex, '').replace(endRegex, '');
    this.view.innerHTML = this.view.innerHTML
      .replace(temp, this.finalText);
  }
  addTag(tag: string)
  {
    let startRegex = new RegExp(`<p(\s?[^>]*)*>`, 'gi');
    let endRegex = new RegExp(`</p>`, 'gi');
    if (this.finalText.match(startRegex))
    {
      let m = this.finalText.match(startRegex)![0];
      let end = this.finalText.match(endRegex)![0];
      let temp = this.finalText;
      this.finalText = this.finalText.replace(startRegex, '').replace(endRegex, '');
      this.finalText = `<${tag}>${this.finalText}</${tag}>`;
      this.finalText = `${m}${this.finalText}${end}`;
      this.view.innerHTML = this.view.innerHTML
        .replace(temp, this.finalText);
    } else
      this.view.innerHTML = this.view.innerHTML
        .replace(this.finalText, `<${tag}>${this.finalText}</${tag}>`);
  }

  removeClass(className: string)
  {
    let temp = this.finalText;
    this.finalText = this.finalText.replace(className, '');
    if (this.finalText.search(/class=("|')("|')/g) > -1)
    {
      let startRegex = new RegExp(`<span(\s?[^>]*)*>`, 'gi');
      let endRegex = new RegExp(`</span>`, 'gi');
      this.finalText = this.finalText.replace(startRegex, '').replace(endRegex, '');
      this.view.innerHTML = this.view.innerHTML
        .replace(temp, this.finalText);
      return;
    }
    this.view.innerHTML = this.view.innerHTML.replace(temp, this.finalText);
  }
  addClass(className: string)
  {
    if (this.finalText.includes("class="))
    {
      let match = this.finalText.match(/class=("|')[^'"><]+("|')/gi)![0];
      let classes = match.substring('class="'.length, match.length - 1);
      let newClassList = className + ' ' + classes;
      let temp = this.finalText;
      this.finalText = this.finalText.replace(classes, newClassList);
      this.view.innerHTML = this.view.innerHTML
        .replace(temp, this.finalText);
    } else
      this.view.innerHTML = this.view.innerHTML
        .replace(this.finalText, `<span class="${className}">${this.finalText}</span>`);
  }
}
