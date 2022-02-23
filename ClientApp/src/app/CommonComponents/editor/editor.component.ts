import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { SelectedTextData } from 'src/Interfaces/interfaces';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, OnChanges
{
  text: SelectedTextData = { text: "", start: -1, end: -1, anchorNode: null, focusNode: null };;
  BootstrapIcons = IconNamesEnum;
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

  bold()
  {
    this.AddRemoveStyle('<strong>', "</strong>");
  }
  italic() { this.AddRemoveStyle('<em>', '</em>'); }
  underline() { this.AddRemoveStyle('<u>', '</u>'); }
  fontSize()
  {

  }
  UpdateHtml()
  {
    this.html.value = this.view.innerHTML;
  }

  AddRemoveStyle(start: string, end: string)
  {
    this.getTextFromRexgex(start, end);
    if (this.selectedText.text === '' && !this.view && !this.html) return;
    if (this.finalText.includes(start) && this.finalText.includes(end))
    {
      let temp = this.finalText;
      this.finalText = this.finalText.replace(new RegExp(`${start}|${end}`, 'g'), '');
      this.view.innerHTML = this.view.innerHTML.toString()
        .replace(temp, this.finalText);
    } else
      this.view.innerHTML = this.view.innerHTML
        .replace(this.finalText, `${start}${this.finalText}${end}`);
    this.UpdateHtml();

  }
  getTextFromRexgex(start: string, end: string)
  {
    this.text = this.selectedText;
    console.log(this.text);

    let startIndex: number = -1;
    let endIndex: number = -1;
    console.log(this.view.childNodes);
    // If we have only one node inside the editable div
    if (this.view.childNodes.length === 1)
    {
      console.log("One Node Only");

      // If this node is text node
      if (this.view.childNodes[0].nodeName === '#text')
      {
        console.log("One Node Only [Text node]");
        this.finalText = this.view.innerHTML.substring(this.text.start, this.text.end);
        console.log("the final text : " + this.finalText);
      }
      //if it is not a text node 
      else
      {
        let Node = (<HTMLElement>this.view.childNodes[0]);
        if (Node.innerText.length === this.text.text.length)
        {
          console.log(`One Node only [${this.view.childNodes[0].nodeName}] innerText [EQUAL]`);
          console.log(`One Node only --- innerText [${Node.innerText}]`);
          console.log(`One Node only --- OuterHtml [${Node.outerHTML}]`);
          this.finalText = (<HTMLElement>Node).outerHTML;
        }
        else if (Node.innerText.length > this.text.text.length)
        {
          console.log(`One Node only [${this.view.childNodes[0].nodeName}] innerText [LOGNER]`);
          console.log(`One Node only --- innerText [${Node.innerText}]`);
          console.log(`One Node only --- OuterHtml [${Node.outerHTML}]`);
          this.finalText = this.text.text;
        } else
        {
          console.log(`One Node only [${this.view.childNodes[0].nodeName}] innerText [LOGNER]`);
          console.log(`One Node only --- innerText [${Node.innerText}]`);
          console.log(`One Node only --- OuterHtml [${Node.outerHTML}]`);

        }
      }
    }
    else if (this.view.childNodes.length > 1)
    {
      console.log("More than one Node");

      this.checkIfSelectionFromLeftToRight(this.text.anchorNode?.textContent, this.text.focusNode?.textContent);
      console.log(this.text);
      let anchorNode: ChildNode | null = null;
      let anchorNodeIndex: number = -1;
      let focusNodeIndex: number = -1;
      let focusNode: ChildNode | null = null;
      for (let i = 0; i < this.view.childNodes.length; i++)
      {
        console.log(this.view.childNodes[i].textContent);

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
      console.log(anchorNode);
      console.log(focusNode);

      if (anchorNode?.textContent!?.length < this.text.text.length)
      {
        if (this.text.start === 0)
        {
          console.log("anchoreNode < text + start = 0");

          this.finalText = this.checkIfItHasTags(String(anchorNode)) === null ? anchorNode?.textContent! : (<HTMLElement>anchorNode).outerHTML;
          console.log(this.finalText);
        }
        else
        {
          let temp = "";
          // if (anchorNode?.nodeName !== "#text")
          //   temp = (<HTMLElement>anchorNode).outerHTML;
          // else
          // {
          //   temp = anchorNode.textContent!;
          // }
          temp = String(anchorNode);
          let tagsMatch = temp.match(/<.+>|<\/.*>/g);
          let IsStartTag: boolean = false;
          let startTag = "";
          if (tagsMatch)
          {
            for (let m of tagsMatch)
            {
              if (temp.startsWith(m)) { IsStartTag = true; startTag = m; break; };
            }
          }
          if (IsStartTag)
          {
            let stringToTag = temp.substring(this.text.start + startTag.length).replace(/<\/.+>/, '');

            temp = temp.replace(stringToTag, `${start}${stringToTag}${end}`);
            (<HTMLElement>this.view.childNodes[anchorNodeIndex]).outerHTML === temp;
          } else
          {

            this.finalText = temp.substring(this.text.start);
          }

        }
      }
      else if (anchorNode?.textContent!?.length === this.text.text.length)
      {
        this.finalText = anchorNode?.nodeName === '#text' ? anchorNode.textContent! : (<HTMLElement>anchorNode).outerHTML;
      } else if (anchorNode?.textContent!?.length > this.text.text.length)
      {
        this.finalText = anchorNode?.textContent!?.substring(this.text.start, this.text.end);
      }

      for (let i = anchorNodeIndex + 1; i < focusNodeIndex; i++)
      {
        this.finalText += this.view.childNodes[i].nodeName === '#text' ? this.view.childNodes[i].textContent : (<HTMLElement>this.view.childNodes[i]).outerHTML;
      }

      if (focusNode?.textContent!?.length < this.text.text.length)
      {
        let temp = "";
        if (focusNode?.nodeName !== "#text")
          temp = (<HTMLElement>focusNode).outerHTML;
        else
        {
          temp = focusNode.textContent!;
        }
        let tagsMatch = temp.match(/<.+>|<\/.*>/g);
        let IsStartTag: boolean = false;
        let startTag = "";
        if (tagsMatch)
        {
          for (let m of tagsMatch)
          {
            if (temp.startsWith(m)) { IsStartTag = true; startTag = m; break; };
          }
        }
        if (IsStartTag)
        {
          let stringToTag = temp.substring(0 + startTag.length, this.text.end).replace(/<\/.+>/, '');

          temp = temp.replace(stringToTag, `${start}${stringToTag}${end}`);
          (<HTMLElement>this.view.childNodes[focusNodeIndex]).outerHTML === temp;
        }
        else
          this.finalText += temp.substring(0, this.text.end);
      }
      console.log("Final string : " + this.finalText);

      // let SelectedTextFromAnchorNode = this.text.anchorNode?.textContent?.substring(this.text.start);
      // let SelectedTextFrom_FocusNode = this.text.focusNode?.textContent?.substring(0, this.text.end);
      // let startIndex = this.view.innerHTML.indexOf(this.text.anchorNode?.textContent!) + this.text.start;
      // let endIndex = this.view.innerHTML.indexOf(this.text.focusNode?.textContent!) + this.text.end;
      // this.finalText = this.view.innerHTML.substring(startIndex, endIndex);
      // console.log("finalText:" + this.finalText);

      // this.finalText = this.view.innerHTML.match(new RegExp(`(<.+>)*${this.finalText}(<\/.+>)*`))!?.join('');

      // console.log("startIndex : " + startIndex);
      // console.log("endIndex : " + endIndex);
      // console.log("finalText:" + this.finalText);
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
    }
  }

  checkIfItHasTags(node: string)
  {
    return node.match(/<.+>|<\/.+>/g);
  }
}
