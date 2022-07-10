import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from 'src/app/CommonComponents/footer/footer.component';
import { HomeNavMenuComponent } from 'src/app/HomeWebsite/home-nav-menu/home-nav-menu.component';
import { HomeComponent } from 'src/app/HomeWebsite/home/home.component';
import { RouterModule } from '@angular/router';
import { NavChildsComponent } from 'src/app/HomeWebsite/home-nav-menu/nav-childs/nav-childs.component';
import { BasicSkeletonComponent } from 'src/app/HomeWebsite/basic-skeleton/basic-skeleton.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
const Modules = [FooterComponent, HomeNavMenuComponent, HomeComponent, BasicSkeletonComponent,

  NavChildsComponent];

@NgModule({
  declarations: [Modules],
  imports: [
    CommonModule, RouterModule, BreadcrumbModule, TranslatePipe
  ],
  exports: [Modules, CommonModule]
})
export class SharedModuleForHomeModule { }
