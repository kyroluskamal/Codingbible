import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, MenuItemType, PostType, sweetAlert, validators } from 'src/Helpers/constants';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { Category, Course, CourseCategory, Lesson, Menu, MenuItem, MenuLocations, Post, Section } from 'src/models.model';
import { MenuService } from 'src/Services/menu.service';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { LoadCATEGORYs } from 'src/State/CategoriesState/Category.actions';
import { selectAllCategorys } from 'src/State/CategoriesState/Category.reducer';
import { LoadCourseCategorys } from 'src/State/CourseCategoryState/CourseCategory.actions';
import { selectAllCourseCategorys } from 'src/State/CourseCategoryState/CourseCategory.reducer';
import { LoadCourses } from 'src/State/CourseState/course.actions';
import { selectAllCourses } from 'src/State/CourseState/course.reducer';
import { LoadLessons } from 'src/State/LessonsState/Lessons.actions';
import { selectAllLessons } from 'src/State/LessonsState/Lessons.reducer';
import { AddMenu, LoadMenus, RemoveMenu, RemoveMenuItem, UpdateIsCompleted, UpdateMenu } from 'src/State/Menu/menu.actions';
import { selectAll_Menus, Select_Menu_UpdateState } from 'src/State/Menu/menu.reducer';
import { LoadPOSTs } from 'src/State/PostState/post.actions';
import { selectAllposts } from 'src/State/PostState/post.reducer';
import { LoadSections } from 'src/State/SectionsState/sections.actions';
import { selectAllSections } from 'src/State/SectionsState/sections.reducer';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css'],
})
export class MenusComponent implements OnInit
{
  constructor(public spinner: SpinnerService,
    private store: Store, private fb: FormBuilder,
    private clientSideService: ClientSideValidationService,
    private TreeDataStructure: TreeDataStructureService<MenuItem>,
    private Notifications: NotificationsService,
    @Inject(DOCUMENT) private document: Document, private MenuService: MenuService) 
  {
  }
  MenuItemForm: FormGroup = new FormGroup({});
  MenuLocations: MenuLocations[] = [];
  selectedMenus: Menu[] = [];
  Posts$ = this.store.select(selectAllposts);
  AllPosts: Post[] = [];
  selectedPosts: Post[] = [];
  Courses$ = this.store.select(selectAllCourses);
  AllCourses: Course[] = [];
  Sections$ = this.store.select(selectAllSections);
  AllSections: Section[] = [];
  selectedSectionsForCourse: Section[] = [];
  Lessons$ = this.store.select(selectAllLessons);
  AllLessons: Lesson[] = [];
  SelectedLessons: Lesson[] = [];
  CourseCategorys$ = this.store.select(selectAllCourseCategorys);
  AllCourseCategory: CourseCategory[] = [];
  PostCategory$ = this.store.select(selectAllCategorys);
  AllPostCategory: Category[] = [];
  selectedMenuItems: MenuItem[] = [];
  currentMenu: Menu | null = null;
  currentMenuItems: MenuItem[] = [];
  CurrentItem: MenuItem = new MenuItem();
  previousItem: MenuItem | null = null;
  currentItemSblings: MenuItem[] = [];
  dragabaleMenuItem!: HTMLElement;
  dragabale_clone!: HTMLElement;
  dragabale_TempHolder!: HTMLElement;
  menuItemsOrder: number[] = [];
  roots: MenuItem[] = [];
  FormControlNames = FormControlNames;
  FormFieldsNames = FormFieldsNames;
  selectedLocation: MenuLocations | null = null;
  PostType = PostType;
  errorState = new BootstrapErrorStateMatcher();
  ActionTypeMenu: string = "";
  ActionTypeMenuItem: string = "";
  MenuForm: FormGroup = new FormGroup({});
  DetectMenuItemForm: FormGroup = new FormGroup({});
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  SblingsOfCurrenMenuItem: MenuItem[] = [];
  ParentToChildrenMap: Map<{ parent: MenuItem, isRoot: boolean; }, MenuItem[]> = new Map<{ parent: MenuItem, isRoot: boolean; }, MenuItem[]>();
  @ViewChild("menuStructureContainer", { read: ElementRef }) menuStructureContainer: ElementRef<HTMLUListElement> = {} as ElementRef<HTMLUListElement>;
  Menus: Menu[] = [];
  Menus$ = this.store.select(selectAll_Menus);
  MenuItemTypeConst = MenuItemType;
  InputFieldTypes = InputFieldTypes;
  selectedMenuItemType: number = 0;
  selectedCourseId: number = 0;
  selectedSectionId: number = 0;
  NewNextMenuItem: MenuItem | null = null;
  NewPreviousMenuItem: MenuItem | null = null;
  NextMenuItem: MenuItem | null = null;
  PreviousMenuItem: MenuItem | null = null;
  MenuItemOrderChanged: boolean = false;
  selectedMenuItemId: number | null = null;
  ngOnInit(): void
  {
    this.dragStart();
    this.MenuService.GetMenuLocations().subscribe(r => this.MenuLocations = r);
    this.store.dispatch(LoadMenus());
    this.Menus$.subscribe(r => { this.Menus = r; this.ShowMenus(this.selectedLocation?.id); });
    this.MenuForm = this.fb.group({
      id: [0],
      [FormControlNames.MenuForm.name]: ['', [validators.required]],
      [FormControlNames.MenuForm.menuLocationsId]: [0, [validators.required]],
    });
    this.MenuItemForm = this.fb.group({
      id: [0],
      [FormControlNames.MenuItemForm.enName]: ['', [validators.required]],
      [FormControlNames.MenuItemForm.enUrl]: ['', [validators.required]],
      [FormControlNames.MenuItemForm.arName]: ['', [validators.required]],
      [FormControlNames.MenuItemForm.arUrl]: ['', [validators.required]],
      [FormControlNames.MenuItemForm.parentKey]: [null, [validators.required]],
      [FormControlNames.MenuItemForm.orderWithinParent]: [1, [validators.required]],
    });
    this.DetectMenuItemForm = this.fb.group({
      [FormControlNames.DetectMenuItemForm.type]: [null, [validators.required]],
      [FormControlNames.DetectMenuItemForm.postId]: [null],
      [FormControlNames.DetectMenuItemForm.courseId]: [null],
      [FormControlNames.DetectMenuItemForm.sectionId]: [null],
      [FormControlNames.DetectMenuItemForm.lessonId]: [null],
      [FormControlNames.DetectMenuItemForm.courseCategoryId]: [null],
      [FormControlNames.DetectMenuItemForm.postCategoryId]: [null],
    });
    this.Sections$.subscribe(r => this.AllSections = r);
    this.CourseCategorys$.subscribe(r =>
    {
      let treeService = new TreeDataStructureService<CourseCategory>();
      treeService.setData(r);
      this.AllCourseCategory = treeService.finalFlatenArray().sort((a, b) => Number(a.isArabic) - Number(b.isArabic));
    });
    this.PostCategory$.subscribe(r =>
    {
      let treeService = new TreeDataStructureService<Category>();
      treeService.setData(r);
      this.AllPostCategory = treeService.finalFlatenArray().sort((a, b) => Number(a.isArabic) - Number(b.isArabic));
    });
    this.DetectMenuItemForm.valueChanges.subscribe(r =>
    {
      if (this.DetectMenuItemForm.invalid)
      {
        this.MenuItemForm.disable();
      }
      else
      {
        this.MenuItemForm.enable();
      }
    });
    this.Courses$.subscribe(r => this.AllCourses = r.sort((a, b) => Number(a.isArabic) - Number(b.isArabic)));
    this.store.dispatch(LoadPOSTs());
    this.Posts$.subscribe(r =>
    {
      this.AllPosts = r.sort((a, b) => Number(a.isArabic) - Number(b.isArabic));
    });
    this.store.select(Select_Menu_UpdateState).subscribe(r =>
    {
      if (r)
      {
        this.currentMenu = this.Menus.filter(m => m.id == this.currentMenu?.id)[0];
        this.ShowItemMenus(this.currentMenu);
        this.MenuItemForm.reset();
        this.DetectMenuItemForm.reset();
        this.store.dispatch(UpdateIsCompleted({ status: false }));
      }
    });
  }

  ShowItemMenus(menu: Menu)
  {
    this.currentMenu = menu;
    this.TreeDataStructure.setData(this.currentMenu.menuItems);
    let roots = this.TreeDataStructure.getRawRoots().sort((a, b) => a.orderWithinParent - b.orderWithinParent);
    this.currentMenuItems = this.TreeDataStructure.finalFlatenArray();
    let tempArray: MenuItem[] = [];
    for (let r of roots)
    {
      tempArray.push(r);
      tempArray.push(...this.getChildren(r));
    }
    this.currentMenuItems = tempArray;
  }

  dragStart()
  {
    this.document.addEventListener("dragstart", (e) =>
    {
      this.dragabaleMenuItem = e.target as HTMLElement;
      // e.dataTransfer!.dropEffect = "move";
      if (this.currentMenu)
        this.CurrentItem = this.currentMenu.menuItems.filter(x => x.id === Number(this.dragabaleMenuItem.getAttribute("id")))[0];
      this.dragabale_clone = this.dragabaleMenuItem.cloneNode(true) as HTMLElement;
      e.dataTransfer!.dropEffect = "move";
      this.dragabale_clone.draggable = true;
      this.dragabale_clone.style.position = "absolute";
      this.dragabale_clone.style.zIndex = "9999";
      this.dragabale_clone.style.cursor = "move";
      this.dragabale_clone.style.boxShadow = "3px 4px 5px 0px #837979";
      this.dragabale_clone.style.width = this.dragabaleMenuItem.offsetWidth + "px";

      this.dragabale_TempHolder = this.document.createElement("div");
      this.dragabale_TempHolder.style.border = "1px dashed black";
      this.dragabale_TempHolder.style.height = this.dragabaleMenuItem.offsetHeight + "px";
      this.dragabale_TempHolder.style.marginLeft = this.dragabaleMenuItem.style.marginLeft;
      this.dragabale_TempHolder.setAttribute("class", "mb-2 rounded-2");

      this.dragabaleMenuItem.insertAdjacentElement("afterend", this.dragabale_clone);
      this.dragabaleMenuItem.insertAdjacentElement("beforebegin", this.dragabale_TempHolder);
      this.dragabaleMenuItem.hidden = true;
      this.document.body.insertAdjacentElement("beforeend", this.dragabaleMenuItem);
    }, false);
    //this event to move the clone
    this.document.addEventListener("mousemove", (mouseevent) =>
    {
      if (this.dragabale_clone)
      {
        this.dragabale_clone.style.top = mouseevent.y - this.dragabale_clone.offsetHeight / 2 + "px";
        if ((<HTMLElement>this.dragabale_TempHolder.nextSibling))
          if (this.dragabale_clone.offsetTop + this.dragabale_clone.offsetHeight >
            (<HTMLElement>this.dragabale_TempHolder.nextSibling).offsetTop + 20)
          {
            this.dragabale_TempHolder.insertAdjacentElement("beforebegin", (<HTMLElement>this.dragabale_TempHolder.nextSibling));
            if (this.currentMenu)
              this.previousItem = this.currentMenu.menuItems.filter(x =>
                x.id === Number((<HTMLElement>this.dragabale_TempHolder.previousSibling).getAttribute("id"))
                && x.id !== Number(this.dragabale_clone.getAttribute('id')))[0];
            this.dragabale_TempHolder.style.marginLeft = this.previousItem ? this.previousItem.level + 1 * 10 + "px" : 0 + "px";
          }
          else
          {
            this.dragabale_TempHolder.insertAdjacentElement("afterend", this.dragabale_clone);
            if ((<HTMLElement>this.dragabale_TempHolder.previousSibling))
              if (this.dragabale_clone.offsetTop <
                (<HTMLElement>this.dragabale_TempHolder.previousSibling).offsetTop + (<HTMLElement>this.dragabale_TempHolder.previousSibling).offsetHeight - 20)
              {
                if (this.currentMenu)
                  this.previousItem = this.currentMenu.menuItems.filter(x => x.id === Number((<HTMLElement>this.dragabale_TempHolder.previousSibling).getAttribute("id"))
                    && x.id !== Number(this.dragabale_clone.getAttribute('id')))[0];
                this.dragabale_TempHolder.insertAdjacentElement("afterend", (<HTMLElement>this.dragabale_TempHolder.previousSibling));
                this.dragabale_TempHolder.style.marginLeft = this.previousItem ? this.previousItem.level + 1 * 10 + "px" : 0 + "px";
              }
          }
        this.dragabale_clone.addEventListener("mouseup", () =>
        {
          // // if (this.dragabale_TempHolder.previousSibling)
          // if (this.dragabale_TempHolder.previousSibling &&
          //   Number((<HTMLElement>this.dragabale_TempHolder.previousSibling).getAttribute('data-level'))
          //   > Number(this.dragabale_clone.getAttribute('data-level')))
          // {
          //   return;
          // }
          if (this.currentMenu)
          {
            this.dragabale_clone.remove();
            this.dragabaleMenuItem.hidden = false;
            this.dragabale_TempHolder.replaceWith(this.dragabaleMenuItem);
            this.previousItem = this.dragabaleMenuItem.previousSibling ? this.currentMenu.menuItems.filter(x => x.id
              === Number((<HTMLElement>this.dragabaleMenuItem.previousSibling).getAttribute("id")))[0] : null;
            this.CurrentItem.parentKey = this.previousItem ? this.previousItem.id! : null;
            this.CurrentItem.level = this.previousItem ? this.previousItem.level + 1 : 0;
            let children = this.currentMenu.menuItems.filter(x => x.parentKey === this.CurrentItem.id);
            children.forEach(x => x.level = this.CurrentItem.level + 1);
          }
          // let childrenInDOM = this.menuStructureContainer.nativeElement
          //   .querySelectorAll(`[data-parentkey="${this.CurrentItem.id}"]`);
          // for (let i = 0; i < childrenInDOM.length; i++)
          // {
          //   this.dragabaleMenuItem.insertAdjacentElement("afterend", childrenInDOM[i]);
          // }
          // this.currentMenu.menuItems.forEach(x =>
          // {
          //   if (x.id === this.CurrentItem.id)
          //   {
          //     x.level = this.CurrentItem.level;
          //     x.parentKey = this.CurrentItem.parentKey;
          //   }
          // });


          for (let i = 0; i < this.menuStructureContainer.nativeElement.children.length; i++)
          {
            this.menuItemsOrder.push(i);
            this.menuStructureContainer.nativeElement.children[i].setAttribute("data-index", i.toString());
          }
        });
      }
    }, false);
  }

  /***************************************************************************************
  *                                        Menu Handeling
  **************************************************************************************/
  //#region Menu Handeling
  AddMenu()
  {
    let menu = new Menu();
    menu.name = this.MenuForm.get(FormControlNames.MenuForm.name)?.value;
    menu.menuLocationsId = this.MenuForm.get(FormControlNames.MenuForm.menuLocationsId)?.value;
    this.store.dispatch(AddMenu(menu));
  }
  DeleteMenu(id: number)
  {
    this.store.dispatch(RemoveMenu({ id: id }));
  }
  EditMenu()
  {
    let menuToUpdate = new Menu();
    menuToUpdate.id = Number(this.MenuForm.get('id')?.value);
    menuToUpdate.name = this.MenuForm.get(FormControlNames.MenuForm.name)?.value;
    menuToUpdate.menuLocationsId = this.MenuForm.get(FormControlNames.MenuForm.menuLocationsId)?.value;
    this.store.dispatch(UpdateMenu(menuToUpdate));
  }
  ShowMenus(value: any)
  {
    this.selectedMenus = [];
    this.selectedLocation = this.MenuLocations.filter(x => x.id === Number(value))[0];
    this.MenuForm.get(FormControlNames.MenuForm.menuLocationsId)?.setValue(Number(value));
    this.selectedMenus.push(...this.Menus.filter(x => x.menuLocationsId === Number(value)));
  }
  onMenuParentChange(parent: HTMLSelectElement)
  {
    let parenKey = Number(parent.value) == 0 ? null : Number(parent.value);
    this.MenuItemForm.get(FormControlNames.MenuItemForm.parentKey)?.setValue(Number(parent.value));
    this.SblingsOfCurrenMenuItem = this.currentMenuItems.filter(x => x.parentKey === parenKey).sort((a, b) => a.orderWithinParent - b.orderWithinParent);
    let currentIndex = this.SblingsOfCurrenMenuItem.findIndex(x => x.id === Number(parent.value));
    this.PreviousMenuItem = currentIndex > 0 ? this.SblingsOfCurrenMenuItem[currentIndex - 1] : null;
    this.NextMenuItem = currentIndex < this.SblingsOfCurrenMenuItem.length - 1 ? this.SblingsOfCurrenMenuItem[currentIndex + 1] : null;
  }
  GetNewSectionPostion()
  {
    if (this.ActionTypeMenuItem === PostType.Add)
    {
      if (Number(this.MenuItemForm.get(FormControlNames.MenuItemForm.orderWithinParent)?.value) > this.SblingsOfCurrenMenuItem.length + 1)
      {
        this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK,
          "You can't insert order more than the number of siblings + 1").then(
            () => this.MenuItemForm.get(FormControlNames.MenuItemForm.orderWithinParent)?.setValue(this.SblingsOfCurrenMenuItem.length + 1)
          );
        return;
      }
    } else
    {
      if (Number(this.MenuItemForm.get(FormControlNames.MenuItemForm.orderWithinParent)?.value) > this.SblingsOfCurrenMenuItem.length)
      {
        this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK,
          "You can't insert order more than the number of siblings").then(
            () => this.MenuItemForm.get(FormControlNames.MenuItemForm.orderWithinParent)?.setValue(this.SblingsOfCurrenMenuItem.length)
          );
        return;
      }
    }
    let newIndex = this.SblingsOfCurrenMenuItem.findIndex(x => x.orderWithinParent
      === Number(this.MenuItemForm.get(FormControlNames.MenuItemForm.orderWithinParent)?.value));
    this.NewNextMenuItem = newIndex > 0 ? this.SblingsOfCurrenMenuItem[newIndex - 1] : null;
    this.NewNextMenuItem = newIndex < this.SblingsOfCurrenMenuItem.length - 1 ? this.SblingsOfCurrenMenuItem[newIndex + 1] : null;
  }
  //#endregion
  /*******************************************************************************************
   *                                      Menu Items Handeling  
   *******************************************************************************************/
  //#region Menu Items Handeling
  // Step one choose menu item type

  ChangeMenuItemType()
  {
    this.MenuItemForm.reset();
    this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.courseCategoryId)?.reset();
    this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.courseId)?.reset();
    this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.sectionId)?.reset();
    this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.lessonId)?.reset();
    this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.postId)?.reset();
    this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.postCategoryId)?.reset();
    if (this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.type)?.value == 'null')
      this.selectedMenuItemType = 0;
    else
      this.selectedMenuItemType = Number(this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.type)?.value);
    this.MenuItemForm.get(FormControlNames.MenuItemForm.orderWithinParent)?.setValue(1);
    this.selectedMenuItemType = Number(this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.type)?.value);
    switch (Number(this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.type)?.value))
    {
      case MenuItemType.Course:
        {
          this.store.dispatch(LoadCourses());
          this.DetectMenuItemForm.clearValidators();
          this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.type)?.setValidators(validators.required);
          this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.courseId)?.setValue(null);
          this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.courseId)?.setValidators(validators.required);
          break;
        }
      case MenuItemType.Post:
        {
          this.store.dispatch(LoadPOSTs());
          this.DetectMenuItemForm.clearValidators();
          this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.type)?.setValidators(validators.required);
          this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.postId)?.setValidators(validators.required);
          break;
        }
      case MenuItemType.Course_Category: {
        this.store.dispatch(LoadCourseCategorys());
        this.DetectMenuItemForm.clearValidators();
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.courseCategoryId)?.setValidators(validators.required);
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.type)?.setValidators(validators.required);
        break;
      }
      case MenuItemType.Post_Category: {
        this.store.dispatch(LoadCATEGORYs());
        this.DetectMenuItemForm.clearValidators();
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.postCategoryId)?.setValidators(validators.required);
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.type)?.setValidators(validators.required);
        break;
      }
      case MenuItemType.Course_section: {
        this.store.dispatch(LoadCourses());
        this.store.dispatch(LoadSections());
        this.DetectMenuItemForm.clearValidators();
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.type)?.setValidators(validators.required);
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.courseId)?.setValidators(validators.required);
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.sectionId)?.setValidators(validators.required);
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.sectionId)?.disable();
        break;
      }
      case MenuItemType.Course_lesson: {
        this.store.dispatch(LoadCourses());
        this.store.dispatch(LoadSections());
        this.store.dispatch(LoadLessons());
        this.DetectMenuItemForm.clearValidators();
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.type)?.setValidators(validators.required);
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.courseId)?.setValidators(validators.required);
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.sectionId)?.setValidators(validators.required);
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.sectionId)?.disable();
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.lessonId)?.setValidators(validators.required);
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.lessonId)?.disable();
        break;
      }
      case MenuItemType.Custom: {
        this.DetectMenuItemForm.clearValidators();
        break;
      }
      default: {
        this.DetectMenuItemForm.reset();
      }
    }
    if (this.selectedMenuItemType > 0)
    {
      if (this.selectedMenuItemType === MenuItemType.Custom)
        this.MenuItemForm.enable();
      else
      {
        this.MenuItemForm.disable();
        this.MenuItemForm.get(FormControlNames.MenuItemForm.arUrl)?.disable();
        this.MenuItemForm.get(FormControlNames.MenuItemForm.enUrl)?.disable();
      }
    }
  }
  ChangeCourse(courseValue: string)
  {
    if (courseValue === "null")
    {
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.sectionId)?.disable();
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.sectionId)?.reset();
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.lessonId)?.disable();
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.lessonId)?.reset();
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.courseId)?.setValue(null);
      this.MenuItemForm.reset();
      this.MenuItemForm.get(FormControlNames.MenuItemForm.orderWithinParent)?.setValue(1);
    }
    else if (this.selectedMenuItemType === MenuItemType.Course)
    {
      this.selectedCourseId = Number(courseValue);
      this.updateMenuItemBasedOnObject(this.AllCourses, Number(courseValue),
        `${HomeRoutes.Courses.Home}/`);

    } else if (this.selectedMenuItemType === MenuItemType.Course_section || this.selectedMenuItemType === MenuItemType.Course_lesson)
    {
      this.store.dispatch(LoadLessons());
      let treeService = new TreeDataStructureService<Section>();
      treeService.setData(this.AllSections.filter(x => x.courseId === Number(courseValue)));
      this.selectedSectionsForCourse = treeService.finalFlatenArray();
      if (courseValue === 'null')
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.sectionId)?.disable();
      else
        this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.sectionId)?.enable();
    }
  }
  ChangeSection(sectionValue: string)
  {
    if (sectionValue === "null")
    {
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.sectionId)?.setValue(null);
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.lessonId)?.disable();
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.lessonId)?.reset();
      this.MenuItemForm.reset();
      this.MenuItemForm.get(FormControlNames.MenuItemForm.orderWithinParent)?.setValue(1);
    }
    else if (this.selectedMenuItemType === MenuItemType.Course_section)
    {
      this.updateMenuItemBasedOnObject(this.AllSections, Number(sectionValue),
        `${HomeRoutes.Courses}/
        ${this.AllCourses.filter(x => x.id === this.selectedCourseId)[0].slug}/section/`);
    } else if (this.selectedMenuItemType === MenuItemType.Course_lesson)
    {
      this.selectedSectionId = Number(sectionValue);
      this.Lessons$.subscribe(x => this.AllLessons = x);
      this.SelectedLessons = this.AllLessons.filter(x => x.sectionId === this.selectedSectionId);
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.lessonId)?.enable();
    }
  }
  ChangeLesson(lessonId: string)
  {
    if (lessonId === 'null')
    {
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.lessonId)?.setValue(null);
      this.MenuItemForm.reset();
      this.MenuItemForm.get(FormControlNames.MenuItemForm.orderWithinParent)?.setValue(1);
    } else
    {
      this.updateMenuItemBasedOnObject(this.AllLessons, Number(lessonId),
        `${HomeRoutes.Courses}/
        ${this.AllCourses.filter(x => x.id === this.selectedCourseId)[0].slug}/lesson/`);
    }
  }
  ChangeCourseCategory(CourseCategoryId: string)
  {
    if (CourseCategoryId === "null")
    {
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.courseCategoryId)?.setValue(null);
      this.MenuItemForm.disable();
      this.MenuItemForm.reset();
      this.MenuItemForm.get(FormControlNames.MenuItemForm.orderWithinParent)?.setValue(1);
    } else
    {
      this.updateMenuItemBasedOnObject(this.AllCourseCategory, Number(CourseCategoryId),
        `${HomeRoutes.Courses.Home}/${HomeRoutes.Courses.Categories}/`);
    }
  }
  ChangePost(PostId: string)
  {
    if (PostId === "null")
    {
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.postId)?.setValue(null);
      this.MenuItemForm.disable();
      this.MenuItemForm.reset();
      this.MenuItemForm.get(FormControlNames.MenuItemForm.orderWithinParent)?.setValue(1);
    } else
    {
      this.updateMenuItemBasedOnObject(this.AllPosts, Number(PostId),
        `${HomeRoutes.Blog.Home}/`);
    }
  }
  ChangePostCategory(postCategoryId: string)
  {
    if (postCategoryId === "null")
    {
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.postCategoryId)?.setValue(null);
      this.MenuItemForm.disable();
      this.MenuItemForm.reset();
      this.MenuItemForm.get(FormControlNames.MenuItemForm.orderWithinParent)?.setValue(1);
    } else
    {
      this.updateMenuItemBasedOnObject(this.AllPostCategory, Number(postCategoryId),
        `${HomeRoutes.Blog.Home}/${HomeRoutes.Blog.Categories}/`);
    }
  }

  AddOrEditMenuItem()
  {
    let menu: Menu = JSON.parse(JSON.stringify(this.currentMenu));
    let menuItem: MenuItem = new MenuItem();
    this.clientSideService.FillObjectFromForm(menuItem, this.MenuItemForm);
    if (menuItem.parentKey === 0)
    {
      menuItem.parentKey = null;
    }
    if (menuItem.parentKey === null)
    {
      menuItem.level = 0;
    } else
    {
      menuItem.level = this.currentMenuItems.filter(x => x.id === menuItem.parentKey)[0].level + 1;
    }
    this;
    menuItem.menuId = menu.id;
    if (this.ActionTypeMenuItem === PostType.Add)
      menu.menuItemToAdd = menuItem;
    else if (this.ActionTypeMenuItem === PostType.Edit)
      menu.menuItemToEdit = menuItem;
    this.store.dispatch(UpdateMenu(menu));
  }
  FillFormFromSelectedMenuItem(item: MenuItem)
  {
    this.MenuItemForm.patchValue(item);
    this.spinner.removeSpinner();
    this.ActionTypeMenuItem = PostType.Edit;
    this.MenuItemForm.enable();
    if (item.parentKey === null)
    {
      this.MenuItemForm.get(FormControlNames.MenuItemForm.parentKey)?.setValue(0);
    }
    this.MenuItemForm.get(FormControlNames.MenuItemForm.arUrl)?.disable();
    this.MenuItemForm.get(FormControlNames.MenuItemForm.enUrl)?.disable();
    this.MenuItemForm.markAllAsTouched();
    this.SblingsOfCurrenMenuItem = this.currentMenuItems.filter(x => x.parentKey === item.parentKey);
  }
  DeleteMenuItem(menuIetmId: number)
  {
    this.store.dispatch(RemoveMenuItem({ id: menuIetmId }));
  }
  //#endregion
  /** ******************************************************************************************
   *                                  Helper functions
   *********************************************************************************************/
  updateMenuItemBasedOnObject<T>(AllArray: T[], id: number, Type: string)
  {
    let selectedOb: any = AllArray.filter((x: any) => x['id'] === id)[0];
    if (Boolean(selectedOb[FormControlNames.courseForm.isArabic]))
    {
      let EnglishObj: any = AllArray.filter((x: any) => x.slug === selectedOb.otherSlug)[0];
      if (this.selectedMenuItemType === MenuItemType.Post || this.selectedMenuItemType === MenuItemType.Post_Category)
        this.updateMenuItemForm(EnglishObj.title, selectedOb.title, EnglishObj.slug, selectedOb.slug, Type);
      else
        this.updateMenuItemForm(EnglishObj.name, selectedOb.name, EnglishObj.slug, selectedOb.slug, Type);
    } else
    {
      let ArabicObj: any = AllArray.filter((x: any) => x.slug === selectedOb.otherSlug)[0];
      if (this.selectedMenuItemType === MenuItemType.Post || this.selectedMenuItemType === MenuItemType.Post_Category)
        this.updateMenuItemForm(selectedOb.title, ArabicObj.title, selectedOb.slug, ArabicObj.slug, Type);
      else
        this.updateMenuItemForm(selectedOb.name, ArabicObj.name, selectedOb.slug, ArabicObj.slug, Type);
    }
    this.MenuItemForm.get(FormControlNames.MenuItemForm.arUrl)?.disable();
    this.MenuItemForm.get(FormControlNames.MenuItemForm.enUrl)?.disable();
    this.MenuItemForm.markAllAsTouched();
  }
  updateMenuItemForm(enName: string, arName: string, enUrl: string, arUrl: string, homeRoute: string)
  {
    this.MenuItemForm.get(FormControlNames.MenuItemForm.enName)?.setValue(enName);
    this.MenuItemForm.get(FormControlNames.MenuItemForm.arName)?.setValue(arName);
    this.MenuItemForm.get(FormControlNames.MenuItemForm.arUrl)?.setValue(homeRoute + arUrl);
    this.MenuItemForm.get(FormControlNames.MenuItemForm.enUrl)?.setValue(homeRoute + enUrl);
    this.paritalDisableMenuItemForm();
  }
  getChildren(MenuItem: MenuItem)
  {
    let children: MenuItem[] = [];
    let finalArray: MenuItem[] = [];
    children = this.currentMenuItems.filter(x => x.parentKey === MenuItem.id).sort((a, b) => a.orderWithinParent - b.orderWithinParent);
    for (let el of children)
    {
      finalArray.push(el);
      finalArray.push(...this.getChildren(el));
    }
    return finalArray;
  }
  paritalDisableMenuItemForm()
  {
    this.MenuItemForm.enable();
    this.MenuItemForm.get(FormControlNames.MenuItemForm.arUrl)?.disable();
    this.MenuItemForm.get(FormControlNames.MenuItemForm.enUrl)?.disable();
  }
  isDescendant(menuItem: MenuItem): boolean
  {
    // let elementToCheckIfItIsParent = this.currentMenuItems.filter(x => x.id === Number(this.MenuItemForm.get('id')?.value))[0];
    let parent = this.currentMenuItems.filter(x => x.id === menuItem.parentKey)[0];
    if (parent)
    {
      if (parent.id === Number(this.MenuItemForm.get('id')?.value))
        return true;
      else
        return this.isDescendant(parent);
    }
    return false;
  }
}
