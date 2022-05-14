import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { FormValidationErrors, FormValidationErrorsNames } from 'src/Helpers/constants';
import { Menu, MenuItem, MenuPositions, Post } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { selectAllposts } from 'src/State/PostState/post.reducer';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css'],
})
export class MenusComponent implements OnInit
{
  constructor(private title: Title, public spinner: SpinnerService,
    private store: Store, private fb: FormBuilder, private TreeDataStructure: TreeDataStructureService<MenuItem>,
    @Inject(DOCUMENT) private document: Document) 
  {
    this.title.setTitle('Menus');
  }
  Form: FormGroup = this.fb.group({
    parent: [],
    order: [],
  });
  MenuPositions: MenuPositions[] = [
    { id: 1, name: 'Blog Menu' },
  ];
  selectedMenus: Menu[] = [];
  Posts = this.store.select(selectAllposts);
  selectedMenuItems: MenuItem[] = [];
  currentMenu: Menu = new Menu();
  CurrentItem: MenuItem = new MenuItem();
  previousItem: MenuItem | null = null;
  currentItemSblings: MenuItem[] = [];
  dragabaleMenuItem!: HTMLElement;
  dragabale_clone!: HTMLElement;
  dragabale_TempHolder!: HTMLElement;
  menuItemsOrder: number[] = [];
  roots: MenuItem[] = [];
  errorState = new BootstrapErrorStateMatcher();
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  ParentToChildrenMap: Map<{ parent: MenuItem, isRoot: boolean; }, MenuItem[]> = new Map<{ parent: MenuItem, isRoot: boolean; }, MenuItem[]>();
  @ViewChild("menuStructureContainer", { read: ElementRef }) menuStructureContainer: ElementRef<HTMLUListElement> = {} as ElementRef<HTMLUListElement>;
  Menus: Menu[] = [
    {
      id: 1, name: "BlogMenu", menuPositionsId: 1, menuPositions: null, menuItems: [
        { id: 1, name: "Home", url: "/", level: 0, orderWithinParent: 1, parentKey: null, parent: null, associatedMenus: [], orderInMenu: 0 },
        { id: 2, name: "About", url: "/about", level: 2, orderWithinParent: 0, parentKey: 4, parent: null, associatedMenus: [], orderInMenu: 0 },
        { id: 3, name: "Contact", url: "/contact", level: 2, orderWithinParent: 1, parentKey: 4, parent: null, associatedMenus: [], orderInMenu: 0 },
        { id: 4, name: "Blog", url: "/blog", level: 1, orderWithinParent: 0, parentKey: 1, parent: null, associatedMenus: [], orderInMenu: 0 },
        { id: 5, name: "Blog Details", url: "/blog-details", level: 0, orderWithinParent: 0, parentKey: null, parent: null, associatedMenus: [], orderInMenu: 0 },

      ]
    }
  ];
  ngOnInit(): void
  {
    this.dragStart();
  }
  SetParent(itemId: number)
  {
    this.CurrentItem = this.currentMenu.menuItems.filter(x => x.id === itemId)[0];
    if (this.CurrentItem.parentKey)
    {
      this.Form.get('parent')?.setValue(this.CurrentItem.parentKey);
      this.currentItemSblings = this.currentMenu.menuItems.filter(x => x.parentKey === this.CurrentItem.parentKey);
    }
    else
    {
      this.Form.get('parent')?.setValue(0);
      this.roots = this.currentMenu.menuItems.filter(i => i.parentKey == null || i.parentKey == 0);
      this.currentItemSblings = this.roots;
    }
    this.Form.get("order")?.setValue(this.CurrentItem.orderWithinParent);
  }
  ChangeParent()
  {
    if (Number(this.Form.get('parent')?.value) === 0)
      this.currentItemSblings = this.currentMenu.menuItems.filter(i => i.parentKey === null || i.parentKey === 0);
    else
      this.currentItemSblings = this.currentMenu.menuItems.filter(i => i.parentKey === Number(this.Form.get('parent')?.value));
  }
  UpdateMenu()
  {
    if (Number(this.Form.get('parent')?.value) !== 0)
    {
      let sbilings = this.currentMenu.menuItems.filter(i => i.parentKey === Number(this.Form.get('parent')?.value));
      if (sbilings.indexOf(this.CurrentItem) > -1)
        sbilings.splice(sbilings.indexOf(this.CurrentItem), 1);
      sbilings.splice(Number(this.Form.get('order')?.value), 0, this.CurrentItem);
      for (let i = 0; i < sbilings.length; i++)
      {
        sbilings[i].orderWithinParent = i;
      }
    } else
    {
      if (this.roots.indexOf(this.CurrentItem) > -1)
        this.roots.splice(this.roots.indexOf(this.CurrentItem), 1);
      this.roots.splice(Number(this.Form.get('order')?.value), 0, this.CurrentItem);
      for (let i = 0; i < this.roots.length; i++)
      {
        this.roots[i].orderWithinParent = i;
      }
    }
    this.CurrentItem.orderWithinParent = Number(this.Form.get('order')?.value);
    this.CurrentItem.parentKey = this.Form.get('parent')?.value == 0 ? null : Number(this.Form.get('parent')?.value);
    this.CurrentItem.level = this.Form.get('parent')?.value == 0 ? 0 : this.currentMenu.menuItems.filter(x => x.id === Number(this.Form.get('parent')?.value))[0].level + 1;
    this.roots = this.currentMenu.menuItems.filter(i => i.parentKey == null || i.parentKey == 0);
    // this.TreeDataStructure.setData(this.currentMenu.menuItems);
    for (let r of this.roots)
    {
      this.recalulateLevels(r);
    }
    this.ParentToChildrenMap = new Map<{ parent: MenuItem, isRoot: boolean; }, MenuItem[]>();
    this.ParentToChildrenMap = this.TreeDataStructure.ParentToChildMap();
    this.currentItemSblings = this.currentMenu.menuItems.filter(i => i.parentKey == this.Form.get('parent')?.value);
    this.currentMenu.menuItems = this.reArrangeMenuItems(this.currentMenu.menuItems);
    console.log(this.currentMenu.menuItems);
  }
  ShowMenus(value: any)
  {
    this.selectedMenus.push(...this.Menus.filter(x => x.menuPositionsId === Number(value)));
  }
  ShowItemMenus(menu: Menu)
  {
    this.currentMenu = menu;
    this.TreeDataStructure.setData(this.currentMenu.menuItems);
    this.currentMenu.menuItems = this.TreeDataStructure.finalFlatenArray();
  }
  AddToOpenedList(post: Post)
  {
    let newMenuItem: MenuItem = {
      id: 0,
      name: post.title,
      url: post.slug,
      level: 0,
      orderWithinParent: 0,
      parentKey: 0,
      parent: null,
      associatedMenus: [{
        menuId: this.currentMenu.id,
        menuItemId: 0,
        menuItem: null,
        menu: null
      }]
      , orderInMenu: 0
    };

    this.currentMenu.menuItems.push(newMenuItem);
  }
  dragStart()
  {

    this.document.addEventListener("dragstart", (e) =>
    {

      this.dragabaleMenuItem = e.target as HTMLElement;
      // e.dataTransfer!.dropEffect = "move";
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
          this.dragabale_clone.remove();
          this.dragabaleMenuItem.hidden = false;
          this.dragabale_TempHolder.replaceWith(this.dragabaleMenuItem);
          this.previousItem = this.dragabaleMenuItem.previousSibling ? this.currentMenu.menuItems.filter(x => x.id
            === Number((<HTMLElement>this.dragabaleMenuItem.previousSibling).getAttribute("id")))[0] : null;
          this.CurrentItem.parentKey = this.previousItem ? this.previousItem.id : null;
          this.CurrentItem.level = this.previousItem ? this.previousItem.level + 1 : 0;
          let children = this.currentMenu.menuItems.filter(x => x.parentKey === this.CurrentItem.id);
          children.forEach(x => x.level = this.CurrentItem.level + 1);
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

          this.recalculateChildren();

          for (let i = 0; i < this.menuStructureContainer.nativeElement.children.length; i++)
          {
            this.menuItemsOrder.push(i);
            this.menuStructureContainer.nativeElement.children[i].setAttribute("data-index", i.toString());
          }
        });
      }
    }, false);
  }
  recalculateChildren()
  {
    this.TreeDataStructure.setData(this.currentMenu.menuItems);
    this.currentMenu.menuItems = this.TreeDataStructure.finalFlatenArray();
    let arrangedArray: MenuItem[] = [];
    this.currentMenu.menuItems.filter(e => e.parentKey === null || e.parentKey === 0).forEach(x =>
    {
      console.log(this.childrenOfChildren(x));
      arrangedArray.push(x);
      arrangedArray.push(...this.childrenOfChildren(x));
    });

    this.currentMenu.menuItems = arrangedArray;
    console.log(this.currentMenu.menuItems);

  }
  isPreviousElInFamily()
  {
    if (this.previousItem)
    {
      let childrenOfCurrentItem =
        this.currentMenu.menuItems.filter(x => x.parentKey === this.CurrentItem.id);

    }
  }
  childrenOfChildren(item: MenuItem)
  {
    let finalArray = [];
    let childrenOfCurrentItem =
      this.currentMenu.menuItems.filter(x => x.parentKey === item.id);
    // if (childrenOfCurrentItem.length === 0) return;
    finalArray.push(...childrenOfCurrentItem);
    childrenOfCurrentItem.forEach(x =>
    {
      finalArray.push(...this.childrenOfChildren(x));
    });
    return finalArray;
  }
  getChildrenFromMap(item: MenuItem, map: Map<{ parent: MenuItem, isRoot: boolean; }, MenuItem[]>): MenuItem[]
  {
    let finalArray: MenuItem[] = [];
    let childrenOfCurrentItem: MenuItem[] = [];
    for (const [key, value] of map)
    {
      if (key.parent.id === item.id)
      {
        childrenOfCurrentItem = value;
      }
    }
    if (childrenOfCurrentItem)
    {
      finalArray.push(...childrenOfCurrentItem!);
      childrenOfCurrentItem!.forEach(x =>
      {
        finalArray.push(...this.getChildrenFromMap(x, map));
      });
    }
    return finalArray;
  }
  reArrangeMenuItems(menuItems: MenuItem[])
  {
    for (let item of this.ParentToChildrenMap.entries())
    {
      item[1].sort((a, b) => a.orderWithinParent - b.orderWithinParent);
    }
    let roots = this.TreeDataStructure.getRawRoots().sort((a, b) => a.orderWithinParent - b.orderWithinParent);

    let FlatentArrangedArray: MenuItem[] = [];
    for (let root of roots)
    {
      FlatentArrangedArray.push(root);
      FlatentArrangedArray = FlatentArrangedArray.concat(this.getChildrenFromMap(root, this.ParentToChildrenMap));
    }
    menuItems = FlatentArrangedArray;
    for (let i = 0; i < menuItems.length; i++)
    {
      menuItems[i].orderInMenu = i;
    }
    return menuItems;
  }
  recalulateLevels(item: MenuItem)
  {
    let children = this.currentMenu.menuItems.filter(x => x.parentKey === item.id);
    for (let child of children)
    {
      child.level = item.level + 1;
      this.recalulateLevels(child);
    }
  }
}
