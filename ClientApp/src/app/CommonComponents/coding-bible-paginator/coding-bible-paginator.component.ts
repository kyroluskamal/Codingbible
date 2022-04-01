import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cb-paginator',
  templateUrl: './coding-bible-paginator.component.html',
  styleUrls: ['./coding-bible-paginator.component.css'],
})
export class CodingBiblePaginatorComponent implements OnInit, OnChanges
{
  @Input() allowedElementsPerPage: number[] = [];
  @Input() DataInTables: any[] = [];
  @Output() GetPages: EventEmitter<Map<number, any[]>> = new EventEmitter<Map<number, any[]>>();
  @Output() CurrentPageUnmber: EventEmitter<number> = new EventEmitter<number>();
  defaultNumberOfElementsPerPage: number = 2;
  DataForPages: any[] = [];
  noOfPages: number = 0;
  notFoundPageNumber: boolean = false;
  currentPageNo: number = 0;
  @Input() ChangeCurrentPage: number = this.currentPageNo;
  Pages: Map<number, any[]> = new Map<number, any[]>();
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void
  {
    if ("DataInTables" in changes)
    {
      this.DataForPages = this.DataInTables;
      console.log(this.DataForPages);
      this.getNumberOfPage();
      this.CreatePages();
    }
    if ("ChangeCurrentPage" in changes)
    {
      this.ChangePage(this.ChangeCurrentPage);
    }
  }

  ngOnInit(): void
  {
    this.DataForPages = this.DataInTables;
    this.ChangePage(this.currentPageNo);
  }
  getNumberOfPage()
  {
    this.noOfPages = Math.ceil(this.DataForPages.length / this.defaultNumberOfElementsPerPage);

  }
  CreatePages()
  {
    this.Pages.clear();
    for (let i = 0; i < this.noOfPages; i++)
    {
      this.Pages.set(i, this.DataForPages.slice(i * this.defaultNumberOfElementsPerPage, (i + 1) * this.defaultNumberOfElementsPerPage));
    }
    this.GetPages.emit(this.Pages);
  }
  ChangePage(pageNumber: number)
  {
    this.currentPageNo = pageNumber;
    this.CurrentPageUnmber.emit(pageNumber);
  }
  PreviousPage()
  {
    this.ChangePage(this.currentPageNo - 1);
  }
  NextPage()
  {
    this.ChangePage(this.currentPageNo + 1);
  }
  ChangePageFromInput(pageNumber: string)
  {
    if (pageNumber.length > 0)
    {
      let requiredPageNo = parseInt(pageNumber) - 1;
      this.notFoundPageNumber = !(requiredPageNo >= 0 && requiredPageNo <= this.noOfPages - 1);
      if (requiredPageNo >= 0 && requiredPageNo <= this.noOfPages - 1)
      {
        this.currentPageNo = requiredPageNo;
        this.CurrentPageUnmber.emit(requiredPageNo);
      }
    }
  }
  ChangePageSize(pageSize: string)
  {
    this.defaultNumberOfElementsPerPage = parseInt(pageSize);
    this.getNumberOfPage();
    this.CreatePages();
    console.log("Current" + this.currentPageNo + 1);
    console.log("Size" + this.noOfPages);

    if (this.currentPageNo + 1 > this.noOfPages)
    {
      this.ChangePage(this.noOfPages - 1);
    }
  }
}
