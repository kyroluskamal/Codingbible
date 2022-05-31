import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { FormControlNames, PostType, sweetAlert } from 'src/Helpers/constants';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { CbTableDataSource, ColDefs } from 'src/Interfaces/interfaces';
import { Attachments, Section } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { SelectAttachment } from 'src/State/Attachments/Attachments.actions';
import { LoadCourses } from 'src/State/CourseState/course.actions';
import { selectAllCourses } from 'src/State/CourseState/course.reducer';
import { AdditionIsComplete, ChangeStatus, GetSectionsByCourseId, LoadSections, RemoveSection, UpdateIsCompleted } from 'src/State/SectionsState/sections.actions';
import { selectAllSections, selectSectionsByID, Select_AdditionState, Select_UpdateState } from 'src/State/SectionsState/sections.reducer';
import { SectionModalComponent } from '../section-modal/section-modal.component';

@Component({
  selector: 'app-show-all-sections',
  templateUrl: './show-all-sections.component.html',
  styleUrls: ['./show-all-sections.component.css'],
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
  SectionActionType: string = "";
  ActionType = PostType;
  DashboardRoutes = DashboardRoutes;
  AllSections: Section[] = [];
  SelectedCourseId: number = 0;
  selectedSections: Section[] = [];
  SectionToAddOrUpdate: Section = new Section();
  SelectedSection: Section = new Section();
  constructor(private store: Store, private title: Title,
    private TreeSections: TreeDataStructureService<Section>,
    private spinner: SpinnerService,
    private router: Router, private NotificationService: NotificationsService)
  {
    this.title.setTitle("Sections");
  }

  ngOnInit(): void
  {
    this.store.dispatch(LoadCourses());
    this.Sections$.subscribe(Sections =>
    {
      this.isLoading = false;
      this.AllSections = Sections;
      this.TreeSections.setData(this.AllSections.filter(Section => Section.courseId == this.SelectedCourseId));
      this.selectedSections = this.TreeSections.finalFlatenArray();
      this.dataSource.data = this.TreeSections.finalFlatenArray();
    });
    this.store.select(Select_AdditionState).subscribe(state =>
    {
      if (state)
      {
        this.onCourseChange(this.SelectedCourseId.toString());
        this.store.dispatch(AdditionIsComplete({ status: false }));
      }
    });
    this.store.select(Select_UpdateState).subscribe(state =>
    {
      if (state)
      {
        this.onCourseChange(this.SelectedCourseId.toString());
        this.store.dispatch(UpdateIsCompleted({ status: false }));
      }
    });
  }

  AddNewSection(event: Boolean, SectionModal: SectionModalComponent)
  {
    if (event)
    {
      this.SectionActionType = PostType.Add;
      if (this.SelectedCourseId == 0)
      {
        this.NotificationService.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, "<h3>Please select a course</h3>");
      }
      else
      {
        SectionModal.Toggle();
      }
    }
  }
  EditSection(event: Section, SectionModal: SectionModalComponent)
  {
    if (event)
    {
      this.SectionToAddOrUpdate = event;
      this.SectionActionType = PostType.Edit;
      this.SelectedCourseId = event.courseId;
      SectionModal.Toggle();
    }
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
    this.spinner.fullScreenSpinner();
    let courseId = Number(CourseId);
    if (courseId > 0)
    {
      this.store.dispatch(GetSectionsByCourseId({ courseId: courseId }));
      this.TreeSections.setData(this.AllSections.filter(Section => Section.courseId == this.SelectedCourseId));
      this.selectedSections = this.TreeSections.finalFlatenArray();
      this.dataSource.data = this.TreeSections.finalFlatenArray();
    }
  }
}
