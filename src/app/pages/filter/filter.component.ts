import { Component, Inject } from '@angular/core';
import { MatChipInputEvent, MatDialogRef, MatOptionSelectionChange, MAT_DIALOG_DATA } from '@angular/material';
import { Category } from 'src/app/model/category';
import { Publisher } from 'src/app/model/publisher';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FilterPayload } from 'src/app/model/dialog';
import { FilterableModel } from 'src/app/model/base';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent {

  selectedCategories = this.input.categories.filter(c => c.visible);
  selectedPublishers = this.input.publishers.filter(p => p.visible);

  keywords: string[] = this.input.keywords;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  
  constructor(
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public input: FilterPayload
  ) { }

  add(event: MatChipInputEvent) {
    let input = event.input;
    let value = event.value;

    if (value && value.trim().length > 0) {
      this.keywords.push(value.trim().toLowerCase());
    }

    if (input) {
      input.value = '';
    }
  }

  remove(keyword: string) {
    let index = this.keywords.indexOf(keyword);
    this.keywords.splice(index, 1);
  }

  reset() {
    this.selectedCategories = this.input.categories;
    this.selectedPublishers = this.input.publishers;
    this.keywords = [];
  }

  submit() {
    this.dialogRef.close(new FilterPayload(this.selectedCategories, this.selectedPublishers, this.keywords));
  }
  
}
