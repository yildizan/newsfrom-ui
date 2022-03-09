import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { LocationService } from 'src/app/service/location.service';
import { Location } from 'src/app/model/location';
import * as Const from 'src/app/options/const-options';

export class SettingsData {
  constructor(
    public location: Location,
    public zoom: number
  ) {}
};

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  defaultLocationId: number;
  defaultZoom: number;
  locations: Location[] = [];

  constructor(
    private locationService: LocationService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SettingsData,
  ) { }

  ngOnInit() {
    this.locationService.list().subscribe(response => {
      this.locations = response.sort(function(a, b) {
        return a.name > b.name ? 1 : -1;
      });
      if(this.data.location != null) {
        this.defaultLocationId = this.data.location.id;
        // user's location
        if(this.data.location.id == 0) {
          this.locations.unshift({
            id: 0,
            latitude: this.data.location.latitude,
            longitude: this.data.location.longitude,
            name: 'My Location'
          });
        }
      }
    });
    this.defaultZoom = this.data.zoom != null ? this.data.zoom : 6;
  }

  locate() {
    navigator.geolocation.getCurrentPosition(
      success => {
        if(this.locations.some(l => l.id == 0)) {
          this.locations[0].latitude = success.coords.latitude;
          this.locations[0].longitude = success.coords.longitude;
        }
        else {
          this.locations.unshift({
            id: 0,
            latitude: success.coords.latitude,
            longitude: success.coords.longitude,
            name: 'My Location'
          });
        }
        this.defaultLocationId = 0;
      },
      _error => {
        this.snackBar.open('❌ Location could not be acquired.', '', { duration: Const.NOTIFICATION_DURATION });
      }
    );
  }

  reset() {
    //this.defaultLocationId = Const.DEFAULT_LOCATION.id;
    //this.defaultZoom = Const.DEFAULT_ZOOM;
  }

  submit() {
    let location = this.locations.find(l => l.id == this.defaultLocationId);
    let zoom = this.defaultZoom;
    this.dialogRef.close({ location: location, zoom: zoom });
  }
}
