import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from 'src/app/CommonComponents/footer/footer.component';
import { HomeNavMenuComponent } from 'src/app/HomeWebsite/home-nav-menu/home-nav-menu.component';
import { HomeComponent } from 'src/app/HomeWebsite/home/home.component';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
import { NavChildsComponent } from 'src/app/HomeWebsite/home-nav-menu/nav-childs/nav-childs.component';

const Modules = [FooterComponent, HomeNavMenuComponent, HomeComponent,
  NavChildsComponent, TranslatePipe];

@NgModule({
  declarations: [Modules],
  imports: [
    CommonModule, RouterModule
  ],
  exports: [Modules, CommonModule]
})
export class SharedModuleForHomeModule { }
