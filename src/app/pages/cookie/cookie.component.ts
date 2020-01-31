import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-cookie',
  templateUrl: './cookie.component.html'
})
export class CookieComponent {

  constructor(public snackBar: MatSnackBar) { }

  close() {
    this.snackBar.dismiss();
  }

}
