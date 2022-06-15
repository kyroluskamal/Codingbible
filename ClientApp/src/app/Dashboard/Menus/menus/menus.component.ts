import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, MenuItemType, PostType, validators } from 'src/Helpers/constants';
import { Category, CourseCategory, Menu, MenuItem, MenuLocations, Post, Section } from 'src/models.model';
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
import { AddMenu, LoadMenus, RemoveMenu, UpdateMenu } from 'src/State/Menu/menu.actions';
import { selectAll_Menus } from 'src/State/Menu/menu.reducer';
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
    private store: Store, private fb: FormBuilder, private TreeDataStructure: TreeDataStructureService<MenuItem>,
    @Inject(DOCUMENT) private document: Document, private MenuService: MenuService) 
  {
  }
  MenuItemForm: FormGroup = new FormGroup({});
  MenuLocations: MenuLocations[] = [];
  selectedMenus: Menu[] = [];
  Posts$ = this.store.select(selectAllposts);
  Courses$ = this.store.select(selectAllCourses);
  Sections$ = this.store.select(selectAllSections);
  AllSections: Section[] = [];
  selectedSectionsForCourse: Section[] = [];
  Lessons$ = this.store.select(selectAllLessons);
  CourseCategorys$ = this.store.select(selectAllCourseCategorys);
  AllCourseCategory: CourseCategory[] = [];
  PostCategory$ = this.store.select(selectAllCategorys);
  AllPostCategory: Category[] = [];
  selectedMenuItems: MenuItem[] = [];
  currentMenu: Menu | null = null;
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
  ParentToChildrenMap: Map<{ parent: MenuItem, isRoot: boolean; }, MenuItem[]> = new Map<{ parent: MenuItem, isRoot: boolean; }, MenuItem[]>();
  @ViewChild("menuStructureContainer", { read: ElementRef }) menuStructureContainer: ElementRef<HTMLUListElement> = {} as ElementRef<HTMLUListElement>;
  Menus: Menu[] = [];
  Menus$ = this.store.select(selectAll_Menus);
  MenuItemTypeConst = MenuItemType;
  InputFieldTypes = InputFieldTypes;
  selectedMenuItemType: number = 0;
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
      [FormControlNames.MenuItemForm.enName]: [''],
      [FormControlNames.MenuItemForm.enUrl]: [''],
      [FormControlNames.MenuItemForm.arName]: [''],
      [FormControlNames.MenuItemForm.arUrl]: [''],
      [FormControlNames.MenuItemForm.parentKey]: [null],
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
      this.AllCourseCategory = treeService.finalFlatenArray();
    });
    this.PostCategory$.subscribe(r =>
    {
      let treeService = new TreeDataStructureService<Category>();
      treeService.setData(r);
      this.AllPostCategory = treeService.finalFlatenArray();
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
  }

  ShowItemMenus(menu: Menu)
  {
    this.currentMenu = menu;
    this.TreeDataStructure.setData(this.currentMenu.menuItems);
    this.currentMenu.menuItems = [...this.TreeDataStructure.finalFlatenArray()];
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
            this.CurrentItem.parentKey = this.previousItem ? this.previousItem.id : null;
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
  /*******************************************************************************************
   *                                      Menu Items Handeling  
   *******************************************************************************************/
  // Step one choose menu item type
  ChangeMenuItemType()
  {
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
    console.log(this.DetectMenuItemForm);
    if (this.selectedMenuItemType === MenuItemType.Custom)
      this.MenuItemForm.enable();
    else
      this.MenuItemForm.disable();
  }
  ChangeCourse(courseValue: string)
  {
    if (courseValue === "null")
    {
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.sectionId)?.disable();
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.courseId)?.setValue(null);
    }
    else
    {
      let treeService = new TreeDataStructureService<Section>();
      treeService.setData(this.AllSections.filter(x => x.courseId === Number(courseValue)));
      this.selectedSectionsForCourse = treeService.finalFlatenArray();
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.sectionId)?.enable();
    }
  }
  ChangeSection(sectionValue: string)
  {
    if (sectionValue === "null")
      this.DetectMenuItemForm.get(FormControlNames.DetectMenuItemForm.sectionId)?.setValue(null);
    else
    {

    }
  }
}
