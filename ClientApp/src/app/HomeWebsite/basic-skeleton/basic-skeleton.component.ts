import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'basic-skeleton',
  templateUrl: './basic-skeleton.component.html',
  styleUrls: ['./basic-skeleton.component.css']
})
export class BasicSkeletonComponent implements OnInit
{
  isArabic = this.store.select(selectLang);
  @Input() ShowSidebar: boolean = true;
  @Input() Body!: TemplateRef<any>;
  constructor(private store: Store, private breadCrumb: BreadcrumbService, private router: Router) { }

  ngOnInit(): void
  {
    if (this.router.url.includes("/ar"))
    {
      this.breadCrumb.set('ar', 'الرئيسية');
      this.breadCrumb.set('', { skip: true });
    } else
    {
      this.breadCrumb.set('', { skip: false });
    }
    this.router.events.subscribe(e =>
    {
      if (e instanceof NavigationEnd)
      {
        if (e.url.includes("/ar"))
        {
          this.breadCrumb.set('ar', 'الرئيسية');
          this.breadCrumb.set('', { skip: true });
        } else
        {
          this.breadCrumb.set('', { skip: false });
        }
      }
    });
  }

}
