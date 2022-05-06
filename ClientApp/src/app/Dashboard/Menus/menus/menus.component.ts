import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Inject, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Menu, MenuItem, MenuPositions, Post } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { selectAllposts } from 'src/State/PostState/post.reducer';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenusComponent implements OnInit
{
  constructor(private title: Title, private store: Store, @Inject(DOCUMENT) private document: Document) 
  {
    this.title.setTitle('Menus');
  }
  MenuPositions: MenuPositions[] = [
    { id: 1, name: 'Blog Menu' },
  ];
  selectedMenus: Menu[] = [];
  Posts = this.store.select(selectAllposts);
  selectedMenuItems: MenuItem[] = [];
  currentMenu: Menu = new Menu();
  dragabaleMenuItem!: HTMLElement;
  dragabale_clone!: HTMLElement;
  dragabale_TempHolder!: HTMLElement;
  @ViewChild("menuStructureContainer") menuStructureContainer!: HTMLElement;
  Menus: Menu[] = [
    {
      id: 1, name: "BlogMenu", menuPositionsId: 1, menuPositions: null, menuItems: [
        { id: 1, name: "Home", url: "/", level: 0, orderWithinParent: 0, parentKey: null, parent: null, associatedMenus: [] },
        { id: 2, name: "About", url: "/about", level: 1, orderWithinParent: 1, parentKey: 1, parent: null, associatedMenus: [] },
        { id: 3, name: "Contact", url: "/contact", level: 3, orderWithinParent: 2, parentKey: 4, parent: null, associatedMenus: [] },
        { id: 4, name: "Blog", url: "/blog", level: 2, orderWithinParent: 3, parentKey: 2, parent: null, associatedMenus: [] },
      ]
    },
    {
      id: 2, name: "BlogMenu", menuPositionsId: 2, menuPositions: null, menuItems: [
        { id: 4, name: "Blog", url: "/blog", level: 0, orderWithinParent: 3, parentKey: 0, parent: null, associatedMenus: [] },
        { id: 5, name: "Blog Details", url: "/blog-details", level: 0, orderWithinParent: 4, parentKey: 0, parent: null, associatedMenus: [] },
        { id: 6, name: "Blog Category", url: "/blog-category", level: 0, orderWithinParent: 5, parentKey: 0, parent: null, associatedMenus: [] },
        { id: 7, name: "Blog Tag", url: "/blog-tag", level: 0, orderWithinParent: 6, parentKey: 0, parent: null, associatedMenus: [] },
        { id: 8, name: "Blog Search", url: "/blog-search", level: 0, orderWithinParent: 7, parentKey: 0, parent: null, associatedMenus: [] },
      ]
    }
  ];
  ngOnInit(): void
  {
    for (let m of this.Menus)
    {
      let TreeDataStructure = new TreeDataStructureService<MenuItem>(m.menuItems, "parentKey");
      m.menuItems = TreeDataStructure.finalFlatenArray();
    }
    this.dragStart();
  }
  ShowMenus(value: any)
  {
    this.selectedMenus.push(...this.Menus.filter(x => x.menuPositionsId === Number(value)));
  }
  ShowItemMenus(menu: Menu)
  {
    this.currentMenu = menu;
    this.selectedMenuItems = this.Menus.filter(x => x.id === menu.id)[0].menuItems;
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
    };

    this.currentMenu.menuItems.push(newMenuItem);
  }
  dragStart()
  {
    let previousItem;
    let currentItem;
    this.document.addEventListener("dragstart", (e) =>
    {

      this.dragabaleMenuItem = e.target as HTMLElement;
      // e.dataTransfer!.dropEffect = "move";
      currentItem = this.currentMenu.menuItems.find(x => x.id === Number(this.dragabaleMenuItem.getAttribute("id")));

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
            previousItem = this.currentMenu.menuItems.filter(x =>
              x.id === Number((<HTMLElement>this.dragabale_TempHolder.previousSibling).getAttribute("id"))
              && x.id !== Number(this.dragabale_clone.getAttribute('id')))[0];
            console.log(previousItem.name);
            this.dragabale_TempHolder.style.marginLeft = (previousItem.level + 1) * 10 + "px";
          }
          else
          {
            this.dragabale_TempHolder.insertAdjacentElement("afterend", this.dragabale_clone);
            if ((<HTMLElement>this.dragabale_TempHolder.previousSibling))
              if (this.dragabale_clone.offsetTop <
                (<HTMLElement>this.dragabale_TempHolder.previousSibling).offsetTop + (<HTMLElement>this.dragabale_TempHolder.previousSibling).offsetHeight - 20)
              {
                this.dragabale_TempHolder.insertAdjacentElement("afterend", (<HTMLElement>this.dragabale_TempHolder.previousSibling));
                previousItem = this.currentMenu.menuItems.filter(x => x.id === Number((<HTMLElement>this.dragabale_TempHolder.previousSibling).getAttribute("id"))
                  && x.id !== Number(this.dragabale_clone.getAttribute('id')))[0];
                console.log(previousItem.name);
                this.dragabale_TempHolder.style.marginLeft = (previousItem.level + 1) * 10 + "px";

              }
          }
        this.dragabale_clone.addEventListener("mouseup", () =>
        {
          this.dragabale_clone.remove();
          this.dragabaleMenuItem.hidden = false;
          this.dragabale_TempHolder.replaceWith(this.dragabaleMenuItem);
        });
      }
    }, false);
  }
}
