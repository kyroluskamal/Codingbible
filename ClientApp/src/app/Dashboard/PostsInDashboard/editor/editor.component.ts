import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SelectedTextData } from 'src/Interfaces/interfaces';

@Component({
  selector: 'CodingBible-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class CodingBibleEditorComponent implements OnInit, OnChanges
{
  text: SelectedTextData = { text: "", start: -1, end: -1, anchorNode: null, focusNode: null };;
  textToReplaceWith: string = "";
  textToReplace: string = "";
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
  @Input() selectedText: SelectedTextData = { text: "", start: -1, end: -1, anchorNode: null, focusNode: null };
  @Input() view!: HTMLDivElement;
  @Input() html!: HTMLTextAreaElement;


  constructor(@Inject(DOCUMENT) private document: Document) { }
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
   *                                      FontSize
   **********************************************************************************/
  setFontSize(fontSize: HTMLSelectElement)
  {
    let sizes = ['fs-1', 'fs-2', 'fs-3', 'fs-4', 'fs-5', 'fs-6'];
    if (this.selectedText.text === '' && !this.view && !this.html) return;
    if (this.textToReplaceWith.includes(fontSize.value))
    {
      this.removeClass(fontSize.value);;
    } else
    {
      for (let s of sizes)
      {
        if (this.textToReplaceWith.includes(`${s}`))
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
    if (this.selectedText.text === '' && !this.view && !this.html) return;
    if (this.textToReplaceWith.includes("text-decoration-line-through"))
    {
      this.removeClass("text-decoration-line-through");
    } else
    {
      this.addClass("text-decoration-line-through");
    }
    this.UpdateHtml();
  }

  /**********************************************************************************
  *                                      Remove styles
  **********************************************************************************/
  RemoveAllStyles()
  {
    this.AddRemoveTag('span');
    let temp = this.textToReplaceWith;
    let tags = this.textToReplaceWith.match(/<[^\/]("[^"]*"|'[^']*'|[^'">])*>|<\/[a-zA-Z0-9]+>/gi);
    // console.log(tags);
    // for (let t of tags!)
    //   if (!t.includes("div") && !t.includes("p") || t.includes("span"))
    this.textToReplaceWith = this.textToReplaceWith.replace(/<[^\/]("[^"]*"|'[^']*'|[^'">])*>|<\/[a-zA-Z0-9]+>/gi, '');
    this.applyChangesToView(temp, this.textToReplaceWith);
  }


  /**********************************************************************************
  *                               Subscript and superscript
  **********************************************************************************/


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

  AddRemoveTag(tag: string)
  {
    this.buildTextToReplace_And_TextToReplaceWith(tag);
  }

  removeClass(className: string)
  {
    let temp = this.textToReplaceWith;
    this.textToReplaceWith = this.textToReplaceWith.replace(className, '');
    if (this.textToReplaceWith.search(/class=("|')("|')/g) > -1)
    {
      let startRegex = new RegExp(`<span(\s?[^>]*)*>`, 'gi');
      let endRegex = new RegExp(`</span>`, 'gi');
      this.textToReplaceWith = this.textToReplaceWith.replace(startRegex, '').replace(endRegex, '');
      this.view.innerHTML = this.view.innerHTML
        .replace(temp, this.textToReplaceWith);
      return;
    }
    this.view.innerHTML = this.view.innerHTML.replace(temp, this.textToReplaceWith);
  }
  addClass(className: string)
  {
    if (this.textToReplaceWith.includes("class="))
    {
      let match = this.textToReplaceWith.match(/class=("|')[^'"><]+("|')/gi)![0];
      let classes = match.substring('class="'.length, match.length - 1);
      let newClassList = className + ' ' + classes;
      let temp = this.textToReplaceWith;
      this.textToReplaceWith = this.textToReplaceWith.replace(classes, newClassList);
      this.view.innerHTML = this.view.innerHTML
        .replace(temp, this.textToReplaceWith);
    } else
      this.view.innerHTML = this.view.innerHTML
        .replace(this.textToReplaceWith, `<span class="${className}">${this.textToReplaceWith}</span>`);
  }


  /*******************************************************************************************
   *                                    Helper functions
  ****************************************************************************************** */
  private buildTextToReplace(anchorNode: ChildNode | null, focusNode: ChildNode | null, tag: string)
  {
    //get the anchorNode text from the selected text
    debugger;
    if (anchorNode?.nodeName === '#text' && focusNode?.nodeName !== '#text')
    {
      this.focusNode_OuterHtml = (<HTMLElement>focusNode)?.outerHTML;
      this.focusNode_StartTag = this.getTheFirstTag(this.focusNode_OuterHtml);
      this.focusNode_EndTag = this.getTheEndTag(this.focusNode_OuterHtml);
      if (this.text.end !== focusNode?.textContent!.length!)
      {
        this.textToReplaceWith = this.NodesBetween_AnchorNode_and_FocusNode === '' ? `<${tag}>${this.anchorNodeText}</${tag}>${this.focusNode_StartTag}<${tag}>${this.focusNodeText}</${tag}>` :
          `<${tag}>${this.anchorNodeText}</${tag}><${tag}>${this.NodesBetween_AnchorNode_and_FocusNode}</${tag}>${this.focusNode_StartTag}<${tag}>${this.focusNodeText}</${tag}>`;
        this.textToReplace = this.anchorNodeText! + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_StartTag + this.focusNodeText;
      } else 
      {
        this.textToReplaceWith = this.NodesBetween_AnchorNode_and_FocusNode === '' ? `<${tag}>${this.anchorNodeText}${this.focusNode_OuterHtml}</${tag}>` :
          `<${tag}>${this.anchorNodeText}${this.NodesBetween_AnchorNode_and_FocusNode}${this.focusNode_OuterHtml}</${tag}>`;
        this.textToReplace = this.anchorNodeText! + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_StartTag + this.focusNodeText + this.focusNode_EndTag;
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
        this.textToReplaceWith = this.NodesBetween_AnchorNode_and_FocusNode === '' ?
          `<${tag}>${this.anchorNodeText}</${tag}>${this.anchorNode_EndTag}<${tag}>${this.focusNodeText}</${tag}>` :
          `<${tag}>${this.anchorNodeText}</${tag}>${this.anchorNode_EndTag}<${tag}>${this.NodesBetween_AnchorNode_and_FocusNode}${this.focusNodeText}</${tag}>`;
        this.textToReplace = this.anchorNodeText + this.anchorNode_EndTag + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNodeText;
      } else if (this.text.start === 0 && (this.text.end !== focusNode?.textContent!.length! || this.text.end === focusNode?.textContent!.length!))
      {
        this.textToReplace = this.anchorNode_OuterHtml + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNodeText;
        this.textToReplaceWith = `<${tag}>${this.textToReplace}</${tag}>`;
      }
    }
    else if (anchorNode?.nodeName !== '#text' && focusNode?.nodeName !== '#text')
    {

      if (this.text.start !== 0 && this.text.end !== focusNode?.textContent!.length!)
      {
        this.textToReplaceWith = this.NodesBetween_AnchorNode_and_FocusNode === '' ?
          `<${tag}>${this.anchorNodeText}</${tag}>${this.anchorNode_EndTag}${this.focusNode_StartTag}<${tag}>${this.focusNodeText}</${tag}>` :
          `<${tag}>${this.anchorNodeText}</${tag}>${this.anchorNode_EndTag}<${tag}>${this.NodesBetween_AnchorNode_and_FocusNode}</${tag}>${this.focusNode_StartTag}<${tag}>${this.focusNodeText}</${tag}>`;
        this.textToReplace = this.anchorNodeText + this.anchorNode_EndTag + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_StartTag + this.focusNodeText;
      }
      else if (this.text.start === 0 && this.text.end !== focusNode?.textContent!.length!)
      {
        this.textToReplaceWith = this.NodesBetween_AnchorNode_and_FocusNode === '' ?
          `<${tag}>${this.anchorNode_OuterHtml}</${tag}>${this.focusNode_StartTag}<${tag}>${this.focusNodeText}</${tag}>` :
          `<${tag}>${this.anchorNode_OuterHtml}${this.NodesBetween_AnchorNode_and_FocusNode}</${tag}>${this.focusNode_StartTag}<${tag}>${this.focusNodeText}</${tag}>`;
        this.textToReplace = this.anchorNode_OuterHtml + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_StartTag + this.focusNodeText;
      }
      else if (this.text.start !== 0 && this.text.end === focusNode?.textContent!.length!)
      {
        this.textToReplaceWith = this.NodesBetween_AnchorNode_and_FocusNode === '' ?
          `<${tag}>${this.anchorNodeText}</${tag}>${this.anchorNode_EndTag}<${tag}>${this.focusNode_OuterHtml}</${tag}>` :
          `<${tag}>${this.anchorNodeText}</${tag}>${this.anchorNode_EndTag}<${tag}>${this.NodesBetween_AnchorNode_and_FocusNode}${this.focusNode_OuterHtml}</${tag}>`;
        this.textToReplace = this.anchorNodeText + this.anchorNode_EndTag + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_StartTag + this.focusNodeText + this.focusNode_EndTag;
      }
      else if (this.text.start === 0 && this.text.end === focusNode?.textContent!.length!)
      {
        this.textToReplace = this.anchorNode_OuterHtml + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNode_OuterHtml;
        this.textToReplaceWith = `<${tag}>${this.textToReplace}</${tag}>`;
      }
    } else
    {
      this.textToReplace = this.anchorNodeText + this.NodesBetween_AnchorNode_and_FocusNode + this.focusNodeText;
      this.textToReplaceWith = `<${tag}>${this.textToReplace}</${tag}>`;
    }
  }
  private buildTextToReplace_And_TextToReplaceWith(tag: string)
  {
    if (tag === "") return;
    this.view.innerHTML = this.view.innerHTML.replace("&nbsp;", "");
    this.checkIfSelectionFromLeftToRight(this.text.anchorNode?.textContent, this.text.focusNode?.textContent);

    this.text = this.selectedText;
    // If we have only one node inside the editable div
    this.find_AnchorNode_and_FocusNode();
    //find the anchor node and focusnode with their indices

    //if the whole selected text is inside one node, the anchorNode and focusNode are the same
    if (this.text.anchorNode === this.text.focusNode || this.anchorNode !== null && this.focusNode === null)
    {

      //if we just clicked inside the node, the selected text is empty and we will select the whole text inside the node
      if (this.text.text === '')
      {
        if (this.anchorNode?.nodeName === '#text')
        {
          this.textToReplace = this.anchorNode.textContent!;
          this.textToReplaceWith = `<${tag}>${this.textToReplace}</${tag}>`;
        } else
        {
          let matchStartTag = this.matchStartTag(this.anchorNode_OuterHtml, tag);
          let matchEndTag = this.matchEndTag(this.anchorNode_OuterHtml, tag);
          this.textToReplace = (<HTMLElement>this.anchorNode).outerHTML!;
          this.textToReplaceWith = this.anchorNode_StartTag.includes(tag) && this.anchorNode_EndTag.includes(tag) ?
            this.replaceLast(this.textToReplace.replace(this.anchorNode_StartTag, ""), `</${tag}>`) :
            matchEndTag === '' && matchStartTag === '' ? `<${tag}>${this.textToReplace}</${tag}>` :
              this.replaceLast(this.textToReplace.replace(matchStartTag, ""), matchEndTag);

        }
      }
      else
      {
        this.anchorNodeText = this.focusNode !== null ? this.anchorNode?.textContent?.substring(this.text.start, this.text.end)! :
          this.anchorNode?.textContent!;
        if (this.anchorNode?.nodeName === '#text')
        {
          let startIndex = this.view.innerHTML.indexOf(this.anchorNode.textContent!) + this.text.start;
          let textBeforeTextToUpdate = this.view.innerHTML.substring(0, startIndex);
          let textToUpdate = this.anchorNodeText;
          let textAfterTextToUpdate = this.view.innerHTML.substring(startIndex + textToUpdate.length);
          this.textToReplace = textBeforeTextToUpdate + textToUpdate + textAfterTextToUpdate;
          this.textToReplaceWith = textBeforeTextToUpdate + `<${tag}>${textToUpdate}</${tag}>` + textAfterTextToUpdate;
        }
        else
        {
          if (this.anchorNode_StartTag.includes(tag) && this.anchorNode_EndTag.includes(tag))
          {
            let startIndex = this.view.innerHTML.indexOf(this.anchorNode_OuterHtml);
            let textBeforeTextToUpdate = this.view.innerHTML.substring(0, startIndex);
            let textToUpdate = this.anchorNode_OuterHtml;
            let textAfterTextToUpdate = this.view.innerHTML.substring(startIndex + textToUpdate.length);

            this.textToReplace = textBeforeTextToUpdate + textToUpdate + textAfterTextToUpdate;
            this.textToReplaceWith = textBeforeTextToUpdate + textToUpdate.replace(this.anchorNode_StartTag, "").replace(this.anchorNode_EndTag, "") + textAfterTextToUpdate;
          } else
          {
            if (this.text.anchorNode?.textContent !== this.anchorNodeText)
            {
              let startIndex = this.view.innerHTML.indexOf(this.anchorNode_OuterHtml);
              let textBeforeTextToUpdate = this.view.innerHTML.substring(0, startIndex);
              let textToUpdate = this.anchorNode_OuterHtml;
              let textAfterTextToUpdate = this.view.innerHTML.substring(startIndex + this.anchorNode_OuterHtml.length);

              this.textToReplace = textBeforeTextToUpdate + textToUpdate + textAfterTextToUpdate;
              this.textToReplaceWith = textBeforeTextToUpdate + `<${tag}>${textToUpdate}</${tag}>` + textAfterTextToUpdate;
            } else
            {
              let startIndex = this.view.innerHTML.indexOf(this.anchorNode_StartTag + this.anchorNode?.textContent?.substring(0, this.text.start)) + this.text.start;
              let textBeforeTextToUpdate = this.view.innerHTML.substring(0, startIndex);
              let textToUpdate = this.anchorNodeText;
              let textAfterTextToUpdate = this.view.innerHTML.substring(startIndex + textToUpdate.length);

              this.textToReplace = textBeforeTextToUpdate + textToUpdate + textAfterTextToUpdate;
              this.textToReplaceWith = textBeforeTextToUpdate + `<${tag}>${textToUpdate}</${tag}>` + textAfterTextToUpdate;
            }

          }
        }
      }
    }
    else
    {
      this.anchorNodeText = this.anchorNode?.textContent?.substring(this.text.start)!;

      this.focusNodeText = this.focusNode?.textContent?.substring(0, this.text.end)!;
      if (this.anchorNode?.nextSibling === this.focusNode)
      {
        this.NodesBetween_AnchorNode_and_FocusNode = "";
        this.buildTextToReplace(this.anchorNode, this.focusNode, tag);
      } else
      {
        for (let i = this.anchorNodeIndex + 1; i < this.focusNodeIndex; i++)
        {
          if (this.view.childNodes[i].nodeName === '#text')
          {
            this.NodesBetween_AnchorNode_and_FocusNode += this.view.childNodes[i].textContent;
          } else
          {
            this.NodesBetween_AnchorNode_and_FocusNode += (<HTMLElement>this.view.childNodes[i]).outerHTML;
          }
        }
        this.buildTextToReplace(this.anchorNode, this.focusNode, tag);
      }
    }
    this.applyChangesToView(this.textToReplace, this.textToReplaceWith);

  }
  applyChangesToView(textToReplace: string, textToReplaceWith: string)
  {
    this.view.innerHTML = this.view.innerHTML.replace(textToReplace, textToReplaceWith);
    this.UpdateHtml();
  }
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
    console.log(match);
    return match === null ? "" : match![match?.length! - 1];
  }
  matchStartTag(text: string, tag: string)
  {
    let re = new RegExp(`<${tag}(\s?[^>]*)*>`);
    let match = text.match(re);
    console.log(match);
    return match === null ? "" : match![0];
  }
  find_AnchorNode_and_FocusNode()
  {
    debugger;
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
    console.log(this.view.childNodes);
    for (let i = 0; i < this.view.childNodes.length; i++)
    {
      if (this.view.childNodes[i].textContent?.includes(this.text.anchorNode?.textContent!))
      {
        this.anchorNode = this.view.childNodes[i];
        this.anchorNodeIndex = i;
      } else
        if (this.view.childNodes[i].textContent?.includes(this.text.focusNode?.textContent!))
        {
          this.focusNode = this.view.childNodes[i];
          this.focusNodeIndex = i;
        }
      if (this.anchorNodeIndex > -1 && this.focusNodeIndex > -1) break;
    }
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
  replaceLast(text: string, tag: string)
  {
    const lastIndexOfL = text.lastIndexOf(tag);

    const removeLastL = text.slice(0, lastIndexOfL) +
      text.slice(lastIndexOfL);
    return removeLastL;
  }
  UpdateHtml()
  {
    this.html.value = this.view.innerHTML;
  }
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent)
  {
    if (event.key === 'Enter')
    {
      // this.document.execCommand('formatBlock', true, 'p');
      // event.preventDefault();
      // this.view.innerHTML = this.view.innerHTML + '<p>klk;l</p>';
      // this.UpdateHtml();
      // let range = this.document.createRange();
      // let sel = window.getSelection();
      // range.setStart(this.view.childNodes[this.view.childNodes.length - 1], 0);
      // range.collapse(true);
      // sel?.removeAllRanges();
      // sel?.addRange(range);
    }
  }
}
