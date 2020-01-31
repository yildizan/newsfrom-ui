import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatExpansionModule,
  MatCardModule,
  MatDividerModule,
  MatListModule,
  MatDialogModule,
  MatSelectModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatSliderModule,
  MatRadioModule,
  MatTooltipModule,
  MatChipsModule
} from '@angular/material';

@NgModule({
  exports: [
    MatButtonModule,
    MatExpansionModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatSliderModule,
    MatRadioModule,
    MatTooltipModule,
    MatChipsModule
  ]
})

export class MaterialModule {}