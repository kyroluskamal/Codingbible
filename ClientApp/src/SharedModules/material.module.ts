import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from '@angular/material/bottom-sheet';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatNativeDateModule } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDividerModule } from '@angular/material/divider';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { personFill, penFill, NgxBootstrapIconsModule, boxArrowRight, gearFill } from 'ngx-bootstrap-icons';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatRippleModule } from '@angular/material/core';

const icons = {
  personFill, penFill, boxArrowRight, gearFill
};
const MaterialComponents = [TooltipModule.forRoot(), MatRippleModule,
  MatButtonModule, MatIconModule, MatDialogModule, MatProgressBarModule,
  MatBottomSheetModule, MatInputModule, MatFormFieldModule, MatStepperModule,
  MatCheckboxModule, MatSidenavModule, MatNativeDateModule, NgxSpinnerModule,
  MatSelectModule, MatMenuModule, MatExpansionModule, FlexLayoutModule, MatSnackBarModule,
  MatTooltipModule, MatChipsModule, MatAutocompleteModule, MatDatepickerModule,
  MatButtonToggleModule, MatSlideToggleModule, MatTableModule, MatDividerModule,
NgxBootstrapIconsModule.pick(icons),
  MatCardModule, MatPaginatorModule, MatSortModule, FontAwesomeModule, MatProgressSpinnerModule
];
@NgModule({
  declarations: [],
  imports: [MaterialComponents],
  exports: [MaterialComponents],
  providers: [
    { provide: MatBottomSheetRef, useValue: {} },
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
    { provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, closeOnNavigation: true, backdropClass: "bg-gray" } },
  ],
})
export class MaterialModule { }