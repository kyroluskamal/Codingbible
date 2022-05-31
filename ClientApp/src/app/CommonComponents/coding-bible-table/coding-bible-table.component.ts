import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { CbTableDataSource, ColDefs } from 'src/Interfaces/interfaces';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { CodingBiblePaginatorComponent } from '../coding-bible-paginator/coding-bible-paginator.component';

@Component({
  selector: 'cb-table',
  templateUrl: './coding-bible-table.component.html',
  styleUrls: ['./coding-bible-table.component.css'],
})
export class CodingBibleTableComponent implements OnInit, OnChanges
{
  @ViewChild("paginator") child!: CodingBiblePaginatorComponent;
  @Input() tableTagClass: string[] = [];
  @Input() ColumnDefs: ColDefs[] = [];
  @Input() UseTree: boolean = false;
  @Input() PropertyToShowLevels: string = "name";
  @Input() PropertyToCountLevel: string = "level";
  @Input() ParentKeyProperty: string = "";
  @Input() isLoading: boolean = true;
  @Input() dataSource: any[] | null = null;
  @Input() Additional_Menu_buttons: TemplateRef<any>[] = [];
  @Input() CustomMenuButton!: TemplateRef<any>;
  @Input() CustomNoDataMessage!: TemplateRef<any>;
  @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() row_Db_Click: EventEmitter<any> = new EventEmitter<any>();
  @Output() AddButtonClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() EditButtonClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() DeleteButtonClicked: EventEmitter<any> = new EventEmitter<any>();
  @Input() resetSelectedRow: boolean = false;
  innerDataSource: CbTableDataSource<any> = new CbTableDataSource<any>();
  SelectedRows: any[] = [];
  selectedRow: any = null;
  loading: boolean = true;
  tableClasses: string = "";
  currentPageNo: number = 0;
  PagesData: Map<number, any[]> = new Map<number, any[]>();
  constructor(private spinnerService: SpinnerService) { }
  ngOnChanges(changes: SimpleChanges): void
  {
    if ("dataSource" in changes)
    {
      let oldNoOfPages = this.PagesData.size;
      this.innerDataSource.Data = this.dataSource;
      if (oldNoOfPages > this.PagesData.size)
      {
        this.SelectedRows = [];
      } else if (oldNoOfPages < this.PagesData.size)
      {
        this.SelectedRows.push(this.selectedRow);
      }
    }
    if ("resetSelectedRow" in changes)
    {
      if (this.resetSelectedRow)
        this.SelectedRows = [];
    }
    if ("isLoading" in changes)
    {
      this.loading = this.isLoading;
      this.spinnerState();
    }
  }


  ngOnInit(): void
  {
    this.innerDataSource.Data = this.dataSource;
    this.currentPageNo = 2;
    this.tableClasses = this.tableTagClass.join(" ");
    this.spinnerState();
  }
  Search(value: string)
  {
    if (value !== "")
    {
      this.innerDataSource.Data = this.dataSource;
      this.innerDataSource.data = this.innerDataSource.filter(value);
    } else
    {
      this.innerDataSource.Data = this.dataSource;
    }
  }
  Pages($event: Map<number, any[]>)
  {
    this.PagesData = $event;
  }
  rowClicked(row: any)
  {
    if (this.SelectedRows.includes(row))
      this.SelectedRows = [];
    else
    {
      this.SelectedRows = [];
      this.SelectedRows.push(row);
    }
    this.rowClick.emit(this.SelectedRows[0]);
  }
  dbClick(row: any)
  {
    this.row_Db_Click.emit(row);
  }
  AddButtonClick()
  {
    this.AddButtonClicked.emit(true);
  }
  EditButtonClick()
  {
    this.EditButtonClicked.emit(this.SelectedRows[0]);
  }
  DeleteButtonClick()
  {
    this.DeleteButtonClicked.emit(this.SelectedRows[0]);
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent)
  {
    let Enter = event.key === "Enter";
    let ArrowUp = event.key === "ArrowUp";
    let ArrowDown = event.key === "ArrowDown";
    if (event.shiftKey && Enter)
      if (this.SelectedRows.length == 1) this.EditButtonClick();
    if (ArrowUp || ArrowDown) this.SelectionByKeyboard(event.key);
    if (event.ctrlKey && event.altKey && event.key === "a") this.AddButtonClick();
    if (event.ctrlKey && event.altKey && event.key === "e") this.EditButtonClick();
    if (event.ctrlKey && event.altKey && event.key === "d") this.DeleteButtonClick();
  }
  SelectionByKeyboard(key: string)
  {
    let ArrowUp = "ArrowUp";
    let ArrowDown = "ArrowDown";
    let CurrentIndex = this.PagesData.get(this.currentPageNo)?.indexOf(this.SelectedRows[0]);
    if (this.SelectedRows.length > 0 && (key === ArrowUp || key === ArrowDown))
    {
      //Case one:  ---------------------------------------------------------
      //If no rows are selected in the current page
      if (CurrentIndex === -1)
      {
        this.SelectedRows = [];
        this.SelectedRows.push(this.PagesData.get(this.currentPageNo)![0]);

        //Case Tow: ----------------------------------------------------------
        //If the first row is selected in the current page
      } else if (CurrentIndex === 0)
      {
        //if the first row is selected and the ArrowDown is pressed
        if (key === ArrowDown)
        {
          this.SelectedRows = [];
          this.SelectedRows.push(this.PagesData.get(this.currentPageNo)![CurrentIndex + 1]);
          //if the first row is selected and the ArrowUp is pressed
        } else if (key === ArrowUp)
        {
          if (this.currentPageNo !== 0)
          {
            this.child.PreviousPage();
            this.SelectedRows = [];
            this.SelectedRows.push(this.PagesData.get(this.currentPageNo)![this.PagesData.get(this.currentPageNo)?.length! - 1]);
          }
        }
        //Case Three: ----------------------------------------- ------------------
        //if the last row is selected in the current page
      } else if (CurrentIndex === this.PagesData.get(this.currentPageNo)!.length - 1)
      {
        if (key === ArrowDown)
        {
          if (this.currentPageNo !== this.PagesData.size - 1)
          {
            this.child.NextPage();
            this.SelectedRows = [];
            this.SelectedRows.push(this.PagesData.get(this.currentPageNo)![0]);
          }
          //if the first row is selected and the ArrowUp is pressed
        } else if (key === ArrowUp)
        {
          this.SelectedRows = [];
          this.SelectedRows.push(this.PagesData.get(this.currentPageNo)![CurrentIndex! - 1]);
        }
      } else
      {
        //Case Four: ----------------------------------------------------------
        //if the row is selected in the current page
        if (key === ArrowDown)
        {
          this.SelectedRows = [];
          this.SelectedRows.push(this.PagesData.get(this.currentPageNo)![CurrentIndex! + 1]);
          //if the first row is selected and the ArrowUp is pressed
        } else if (key === ArrowUp)
        {
          this.SelectedRows = [];
          this.SelectedRows.push(this.PagesData.get(this.currentPageNo)![CurrentIndex! - 1]);
        }
      }
    } else if (this.SelectedRows.length === 0 && (key === ArrowUp || key === ArrowDown))
    {
      this.SelectedRows.push(this.PagesData.get(this.currentPageNo)![0]);
    }
    this.rowClicked(this.SelectedRows[0]);
  }
  spinnerState()
  {
    if (this.loading)
    {
      this.spinnerService.fullScreenSpinnerForForm();
    } else
    {
      this.spinnerService.removeSpinner();
    }
  }
}
