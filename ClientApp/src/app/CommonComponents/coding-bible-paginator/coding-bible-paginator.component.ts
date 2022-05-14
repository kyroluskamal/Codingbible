import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectorRef, AfterViewInit, AfterViewChecked, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cb-paginator',
  templateUrl: './coding-bible-paginator.component.html',
  styleUrls: ['./coding-bible-paginator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CodingBiblePaginatorComponent implements OnInit, OnChanges, AfterViewChecked
{
  @Input() allowedElementsPerPage: number[] = [];
  @Input() DataInTables: any[] = [];
  @Output() GetPages: EventEmitter<Map<number, any[]>> = new EventEmitter<Map<number, any[]>>();
  @Output() CurrentPageUnmber: EventEmitter<number> = new EventEmitter<number>();
  defaultNumberOfElementsPerPage: number = 2;
  DataForPages: any[] = [];
  pagesinNumber: number[] = [];
  noOfPages: number = 1;
  notFoundPageNumber: boolean = false;
  currentPageNo: number = 0;
  @Input() ChangeCurrentPage: number = this.currentPageNo;
  Pages: Map<number, any[]> = new Map<number, any[]>();
  constructor(private cdr: ChangeDetectorRef) { }
  ngAfterViewChecked(): void
  {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if ("DataInTables" in changes)
    {
      let oldPageNumbers = this.noOfPages;
      let oldCurrenpage = this.currentPageNo;
      this.DataForPages = this.DataInTables;
      this.getNumberOfPage();
      this.CreatePages();
      if (oldPageNumbers < this.noOfPages)
      {
        this.NextPage();
      }
      else if (oldPageNumbers > this.noOfPages)
      {
        this.PreviousPage();
      }
    }
    if ("ChangeCurrentPage" in changes)
    {
      this.ChangePage(this.ChangeCurrentPage);
    }
    this.cdr.detectChanges();
  }

  ngOnInit(): void
  {
    this.Pages.clear();
    this.DataForPages = this.DataInTables;
    this.ChangePage(this.currentPageNo);
    this.CreatePages();
  }
  getNumberOfPage()
  {
    if (this.DataForPages)
      this.noOfPages = Math.ceil(this.DataForPages.length / this.defaultNumberOfElementsPerPage);
  }
  CreatePages()
  {
    this.Pages.clear();
    this.pagesinNumber = [];
    if (this.DataForPages)
      for (let i = 0; i < this.noOfPages; i++)
      {
        this.pagesinNumber.push(i);
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
    if (this.currentPageNo + 1 > this.noOfPages)
    {
      this.ChangePage(this.noOfPages - 1);
    }
  }
}
