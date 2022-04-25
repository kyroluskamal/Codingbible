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
   *                               SetHeaders
   **********************************************************************************/
  SetHeader(header: HTMLSelectElement)
  {
    debugger;
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
  Strikethrough()
  {
    if (this.selectedText.text === '' && !this.view && !this.html) return;
    this.tag = "span";
    this.addRemoveClass("text-decoration-line-through");
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
    debugger;
    this.view.innerHTML = this.view.innerHTML.replace("&nbsp;", "");
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
          this.textToTag = [{ text: textBeforeTextToUpdate, needTag: false }, { text: this.textToReplace, needTag: true }, { text: textAfterTextToUpdate, needTag: false }];
        }
        else
        {
          //if we select part of the text of the anchorNode
          if (this.text.anchorNode?.textContent !== this.anchorNodeText)
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
            let startIndex = this.view.innerHTML.indexOf(this.anchorNode_StartTag + this.anchorNode?.textContent?.substring(0, this.text.start)) + this.text.start;
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
        for (let i = 0; i < this.view.childNodes.length; i++)
        {
          if (this.view.childNodes[i].isEqualNode(this.anchorNode))
          {
            this.anchorNodeIndex = i;
            continue;
          }
          if (this.view.childNodes[i].isEqualNode(this.focusNode))
          {
            this.focusNodeIndex = i;
          }
        }
        //get the html code between the 2 nodes
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
        this.buildTextToReplace(this.anchorNode, this.focusNode);
      }
    }
  }
  applyChangesToView(textToReplace: string, textToReplaceWith: string)
  {
    this.view.innerHTML = this.view.innerHTML.replace(textToReplace, textToReplaceWith);
    this.UpdateHtml();
  }
  addRemoveTag(tag: string)
  {
    debugger;
    if (this.textToTag.length === 0) return;
    if (this.treatTextToTagElementsIndependentily)
    {
      let startTag = new RegExp(`<${tag}(\s?[^>]*)*>`);
      for (let t of this.textToTag)
      {
        if (t.needTag)
        {
          let start_of_string = t.text.substring(0, this.anchorNodeText.length);
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
      let startTag = new RegExp(`<${tag}(\s?[^>]*)*>`);
      for (let t of this.textToTag)
      {
        if (t.needTag)
        {
          let start_of_string = t.text.substring(0, this.anchorNodeText.length);

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
    debugger;
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
    let re = new RegExp(`<${tag}(\s?[^>]*)*>`);
    let match = null;
    if (text)
    {
      match = text.match(re);
    }
    return match === null ? "" : match![0];
  }
  prepare_AnchorNode_and_FocusNode()
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
    this.anchorNode = this.extractAnchorNode(this.view.childNodes);
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
    debugger;

    for (let i = 0; i < nodeList.length; i++)
    {
      if (x !== null) return x;
      let start_of_string = (<HTMLElement>nodeList[i]).outerHTML ? (<HTMLElement>nodeList[i]).outerHTML.substring(0, `<${this.tag}`.length) : "";

      if (nodeList[i].isEqualNode(this.text.anchorNode!)
        || nodeList[i].isEqualNode(this.text.anchorNode?.parentElement!)
        || start_of_string.includes(this.tag)
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
    debugger;
    for (let i = 0; i < nodeList.length; i++)
    {
      if (x !== null) return x;
      let n = nodeList[i];
      let start_of_string = (<HTMLElement>nodeList[i]).outerHTML ? (<HTMLElement>nodeList[i]).outerHTML.substring(0, `<${this.tag}`.length) : "";

      if (nodeList[i].isEqualNode(this.text.focusNode!) ||
        nodeList[i].isEqualNode(this.text.focusNode?.parentElement!)
        || start_of_string.includes(this.tag)
        && ((<HTMLElement>nodeList[i]).innerText && (<HTMLElement>nodeList[i]).innerText.includes(this.text.focusNode?.textContent!)))
      {
        x = nodeList[i];
        return x;
      } else
        x = this.extractFocusNode(nodeList[i].childNodes, x);
    }
    return x;
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
