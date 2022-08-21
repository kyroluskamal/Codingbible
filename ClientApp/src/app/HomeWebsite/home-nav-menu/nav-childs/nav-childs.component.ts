import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { selectLang } from 'src/State/LangState/lang.reducer';

@Component({
  selector: 'nav-childs',
  templateUrl: './nav-childs.component.html',
  styleUrls: ['./nav-childs.component.css'],
})
export class NavChildsComponent implements OnInit, OnChanges
{
  isArabic$ = this.store.select(selectLang);
  isArabic: boolean = false;
  noOfChildren: number = 0;
  @Input() MenuItems: MenuItem[] = [];
  @Input() MenuItemChild: MenuItem | null = null;
  constructor(private tree: TreeDataStructureService<MenuItem>,
    private store: Store) { }
  ngOnChanges(changes: SimpleChanges): void
  {
    if ("MenuItems" in changes)
    {
      this.tree.setData(this.MenuItems);
      this.noOfChildren = this.Children(this.MenuItemChild!).length;
    }
  }

  ngOnInit(): void
  {
    this.tree.setData(this.MenuItems);
    this.isArabic$.subscribe(x => this.isArabic = x);
  }
  Children(menuItem: MenuItem): MenuItem[]
  {
    return this.tree.getChilrenByParentId(this.MenuItemChild?.id!);
  }
  dorpDownOpen(menu: HTMLElement, parent: HTMLElement)
  {
    let rectParent = parent.getBoundingClientRect();
    menu.classList.add("show");
    if (!this.isArabic)
    {
      if (rectParent.left + parent.offsetWidth + menu.offsetWidth >= window.innerWidth)
      {
        menu.style.setProperty('transform', `translateX(${-1 * menu.parentElement?.offsetWidth!}px)`, 'important');
      } else
      {
        menu.style.setProperty('transform', `translateX(${menu.offsetWidth}px)`, 'important');
      }
    } else
    {
      if (rectParent.left - rectParent.width < 0)
      {
        menu.style.setProperty('transform', `translateX(${menu.parentElement?.offsetWidth!}px)`, 'important');
      } else
      {
        menu.style.setProperty('transform', `translateX(${-1 * menu.offsetWidth}px)`, 'important');
      }
    }

    parent.classList.add("active");
  }
  dropDownCLose(menu: HTMLElement, parent: HTMLElement)
  {
    // let isChildIsOpen = false;
    // if (menu.children.length === 0)
    // {
    //   for (let i = 0; i < menu.children.length; i++)
    //   {
    //     if (menu.children[i].classList.contains("show"))
    //     {
    //       isChildIsOpen = true;
    //     }
    //   }
    // }
    // if (!isChildIsOpen)
    //   menu.classList.remove("show");
    parent.classList.remove("active");
  }
}
