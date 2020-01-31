import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { News } from 'src/app/model/news';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import * as Const from 'src/app/options/const-options';
import { Category } from 'src/app/model/category';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-cluster',
  styleUrls: ['./cluster.component.scss'],
  templateUrl: './cluster.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ClusterComponent implements OnInit {

  facebookUrl: string = Const.FACEBOOK_SHARE_URL;
  twitterUrl: string = Const.TWITTER_SHARE_URL;
  categories: Category[] = [];
  list: Map<Number, News[]> = new Map();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.categories = this.data.categories.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1);
    for(let category of this.data.categories) {
      this.list.set(+category.id, this.data.news.filter(n => n.categoryId == category.id));
    }
  }

  notifyCopy() {
    this.snackBar.open('✔️ Link copied to clipboard.', null, { duration: Const.NOTIFICATION_DURATION });
  }

  onExpand(news: News) {
    news.isRead = true;
  }

  styleBackground(categoryId: number) {
    return this.sanitizer.bypassSecurityTrustStyle('linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 35%, rgba(255,255,255,1) 65%, rgba(255,255,255,0) 100%), url(' + this.categories.find(c => c.id == categoryId).background + ')');
  }
}
