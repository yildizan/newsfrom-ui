import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Category } from 'src/app/model/category';
import { Publisher } from 'src/app/model/publisher';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export class FilterData {
  constructor(
    public categories: Category[],
    public publishers: Publisher[],
    public keywords: string[]
  ) {}
};

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent {

  categories: number[] = this.data.categories.filter(c => c.selected).map(c => c.id);
  publishers: number[] = this.data.publishers.filter(p => p.selected).map(p => p.id);
  keywords: string[] = JSON.parse(JSON.stringify(this.data.keywords));
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  
  constructor(
    public dialogRef: MatDialogRef<FilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterData
  ) { }

  add(event: any) {
    let input = event.input;
    let value = event.value;

    if((value || '').trim()) {
      this.keywords.push(value.trim());
    }

    if(input) {
      input.value = '';
    }
  }

  remove(keyword: string) {
    let index = this.keywords.indexOf(keyword);
    this.keywords.splice(index, 1);
  }

  reset() {
    this.categories = this.data.categories.map(c => c.id);
    this.publishers = this.data.publishers.map(p => p.id);
    this.keywords = [];
  }

  submit() {
    this.dialogRef.close({
      categories: this.categories, publishers: this.publishers, keywords: this.keywords
    });
  }
}
