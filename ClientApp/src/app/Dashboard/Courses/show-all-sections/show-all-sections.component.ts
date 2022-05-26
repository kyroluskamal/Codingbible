import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { FormControlNames, PostType } from 'src/Helpers/constants';
import { CbTableDataSource, ColDefs } from 'src/Interfaces/interfaces';
import { Attachments, Section } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { SelectAttachment } from 'src/State/Attachments/Attachments.actions';
import { LoadCourses } from 'src/State/CourseState/course.actions';
import { selectAllCourses } from 'src/State/CourseState/course.reducer';
import { ChangeStatus, LoadSections, RemoveSection } from 'src/State/SectionsState/sections.actions';
import { selectAllSections, selectSectionsByID } from 'src/State/SectionsState/sections.reducer';

@Component({
  selector: 'app-show-all-sections',
  templateUrl: './show-all-sections.component.html',
  styleUrls: ['./show-all-sections.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowAllSectionsComponent implements OnInit
{
  colDefs: ColDefs[] = [
    { field: "id", display: "#" },
    { field: "name", display: "Name", },
  ];
  resetSelectedRow: boolean = false;
  dataSource: CbTableDataSource<Section> = new CbTableDataSource<Section>();
  Sections$ = this.store.select(selectAllSections);
  Courses$ = this.store.select(selectAllCourses);
  isLoading = true;
  Action: string = "";
  AllSections: Section[] = [];
  selectedSections: Section[] = [];
  SectionToAddOrUpdate: Section = new Section();
  SectionForm: FormGroup = new FormGroup({});
  SelectedSection: Section = new Section();
  constructor(private store: Store, private title: Title,
    private TreeSections: TreeDataStructureService<Section>,
    private router: Router, private NotificationService: NotificationsService)
  {
    this.title.setTitle("Sections");
  }

  ngOnInit(): void
  {
    this.store.dispatch(LoadCourses());
    this.store.dispatch(LoadSections());
    this.Sections$.subscribe(Sections =>
    {
      this.isLoading = false;
      this.AllSections = Sections;
    });
  }

  AddNewSection(event: Boolean)
  {
    if (event)
    {
      // this.router.navigate(['', DashboardRoutes.Home, DashboardRoutes.Sections.Home, DashboardRoutes.Sections.Wizard], { queryParams: { action: PostType.Add } });
    }
  }
  EditSection(event: Section)
  {
    if (event)
    {
      // this.router.navigate(['', DashboardRoutes.Home, DashboardRoutes.Sections.Home, DashboardRoutes.Sections.Wizard], { queryParams: { action: PostType.Edit, step: "step1", SectionId: event.id } });
    }
    this.SectionToAddOrUpdate = event;
    this.Action = PostType.Edit;
  }
  DeleteSection(event: Section)
  {
    this.NotificationService.Confirm_Swal().then(result =>
    {
      if (result.value)
      {
        this.store.dispatch(RemoveSection({ id: event.id, url: "" }));
        this.resetSelectedRow = true;
        this.selectedSections.splice(this.selectedSections.indexOf(event), 1);
      }
    });
  }
  SetFeatureImage(attachment: Attachments | null)
  {
    this.SectionToAddOrUpdate.featureImageUrl = attachment?.fileUrl!;
  }
  removeFeatureImage()
  {
    this.store.dispatch(SelectAttachment({ selectedFile: null }));
    this.SectionToAddOrUpdate.featureImageUrl = "";
    this.SectionForm.get(FormControlNames.SectionForm.featureImageUrl)?.setValue("");
  }
  SelectSection(event: Section)
  {
    this.SelectedSection = event;
    this.SectionToAddOrUpdate = event;
  }
  ChangeStatus(status: number)
  {
    let SectionToUpdate = { ...this.SelectedSection };
    SectionToUpdate.status = status;
    this.store.dispatch(ChangeStatus(SectionToUpdate));
    this.store.select(selectSectionsByID(this.SelectedSection.id)).subscribe(Section =>
    {
      if (Section)
        this.SelectSection(Section);
    });
  }
  onCourseChange(CourseId: string)
  {
    let courseId = Number(CourseId);
    if (courseId > 0)
    {
      this.TreeSections.setData(this.AllSections.filter(Section => Section.courseId == courseId));
      this.selectedSections = this.TreeSections.finalFlatenArray();
      this.dataSource.data = this.TreeSections.finalFlatenArray();
    }
  }
}
