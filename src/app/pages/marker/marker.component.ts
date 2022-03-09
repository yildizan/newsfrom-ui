import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { News } from 'src/app/model/news';
import * as Const from 'src/app/options/const-options';

@Component({
  selector: 'app-marker',
  styleUrls: ['./marker.component.scss'],
  templateUrl: './marker.component.html'
})
export class MarkerComponent {

  facebookUrl: string = Const.FACEBOOK_SHARE_URL;
  twitterUrl: string = Const.TWITTER_SHARE_URL;

  constructor(
    @Inject(MAT_DIALOG_DATA) public news: News,
    private snackBar: MatSnackBar
  ) { }

  notifyCopy() {
    this.snackBar.open('✔️ Link copied to clipboard.', null, { duration: Const.NOTIFICATION_DURATION });
  }

}
