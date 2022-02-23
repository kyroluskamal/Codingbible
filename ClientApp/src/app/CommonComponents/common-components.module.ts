import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardTitleOnlyComponent } from './mat-card-title-only/mat-card-title-only.component';
import { MaterialModule } from '../../SharedModules/material.module';
import { GenericFormComponent } from './generic-form/generic-form.component';
import { SharedModule } from '../../SharedModules/shared.module';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { GenericStepperComponent } from './generic-stepper/generic-stepper.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { EditorComponent } from './editor/editor.component';

const commonComponents = [NotFoundComponent,
  MatCardTitleOnlyComponent, GenericFormComponent, GenericTableComponent, GenericStepperComponent,
  EditorComponent
];

@NgModule({
  declarations: [commonComponents],
  imports: [MaterialModule, SharedModule,
    CommonModule
  ],
  exports: [commonComponents]
})
export class CommonComponentsModule { }
