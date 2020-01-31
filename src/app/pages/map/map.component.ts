import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CategoryService } from 'src/app/service/category.service';
import { NewsService } from 'src/app/service/news.service';
import { PublisherService } from 'src/app/service/publisher.service';
import { MAP_OPTIONS } from 'src/app/options/map-options';
import * as Const from 'src/app/options/const-options';
import { MarkerComponent } from 'src/app/pages/marker/marker.component';
import { ClusterComponent } from 'src/app/pages/cluster/cluster.component';
import { FilterData, FilterComponent } from 'src/app/pages/filter/filter.component';
import { SettingsData, SettingsComponent } from 'src/app/pages/settings/settings.component';
import { InfoComponent } from 'src/app/pages/info/info.component';
import { CookieComponent } from 'src/app/pages/cookie/cookie.component';
import { Filter } from 'src/app/model/filter';
import { Category } from 'src/app/model/category';
import { Publisher } from 'src/app/model/publisher';
import { Location } from 'src/app/model/location';
import { News } from 'src/app/model/news';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';

declare var L: any;

@Component({
  selector: 'app-map',
  template: '<div id="map" class="map-container"></div>',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {

  @ViewChild('map', { static: true }) mapElement: any;
  map: any;
  cluster: any;
  markers: any;
  categories: Category[] = [];
  publishers: Publisher[] = [];
  keywords: string[] = [];
  news: News[];
  defaultLocation = Const.DEFAULT_LOCATION;
  defaultZoom = Const.DEFAULT_ZOOM;

  constructor(
    private categoryService: CategoryService,
    private publisherService: PublisherService,
    private newsService: NewsService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initMap();
    this.categoryService.list().subscribe(response => {
      this.categories = response;
      if(!this.filterWithCookie(Const.CATEGORY_COOKIE, this.categories)) {
        this.categories.forEach(c => c.selected = true);
      }
    });
    this.publisherService.list().subscribe(response => {
      this.publishers = response;
      if(!this.filterWithCookie(Const.PUBLISHER_COOKIE, this.publishers)) {
        this.publishers.forEach(p => p.selected = true);
      }
    });
    this.newsService.list().subscribe(response => {
      this.news = response;
      this.news.forEach((n, i) => n.index = i);
      this.checkRead();
      this.applyFilter();
      this.route.paramMap.subscribe(params => {
        let id = +params.get('id');
        if(id) {
          this.newsService.get(id).subscribe(n => this.openParam(n));
        }
      });
    });
    if(!this.cookieService.check(Const.NOTIFICATION_COOKIE)) {
      this.snackBar.openFromComponent(CookieComponent).afterDismissed().subscribe(
        () => this.cookieService.set(Const.NOTIFICATION_COOKIE, '')
      );
    }
  }

  filterWithCookie(name: string, collection: Filter[]): boolean {
    if(this.cookieService.check(name)) {
      let filters = this.cookieService.get(name).split(';');
      collection.forEach(c => c.selected = filters.some(f => c.id.toString() == f));
      return true;
    }
    else {
      return false;
    }
  }

  locateWithCookie(): void {
    if(this.cookieService.check(Const.LOCATION_COOKIE)) {
      let tokens = this.cookieService.get(Const.LOCATION_COOKIE).split(Const.COOKIE_SEPARATOR);
      let location = new Location();
      location.id = +tokens[0];
      location.latitude = +tokens[1];
      location.longitude = +tokens[2];
      this.defaultLocation = location;
    }
    if(this.cookieService.check(Const.ZOOM_COOKIE)) {
      this.defaultZoom = +this.cookieService.get(Const.ZOOM_COOKIE);
    }
  }

  setDefaultView() {
    this.map.setView([this.defaultLocation.latitude, this.defaultLocation.longitude],
      this.defaultZoom + 1);
  }

  initMap() {
    this.map = L.map('map');
    L.tileLayer(Const.MAP_API, MAP_OPTIONS).addTo(this.map);
    L.easyButton('<i class="fas fa-search"></i>', () => this.openFilter()).addTo(this.map);
    L.easyButton('<i class="fas fa-cog"></i>', () => this.openSettings()).addTo(this.map);
    L.easyButton('<i class="fas fa-info"></i>', () => this.openInfo()).addTo(this.map);
    this.locateWithCookie();
    this.setDefaultView();
  }

  initMarkers(list: News[]) {
    this.markers = [];

    let unreadIcon = L.icon(Const.UNREAD_ICON);
    let readIcon = L.icon(Const.READ_ICON);

    for(let news of list) {
      this.markers.push(
        L.marker(
          [news.latitude, news.longitude],
          {
            icon: news.isRead ? readIcon : unreadIcon,
            index: news.index
          }
        ).on('click', (e) => this.onMarkerClick(e))
      );
    }
  }

  initCluster() {
    if(this.cluster == null) {
      this.cluster = new L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
          let count = cluster.getChildCount();
        
          let i = 0;

          if (count < 10) i = 1;
          else if (count < 50) i = 2;
          else if (count < 100) i = 3;
          else if (count < 250) i = 4;
          else i = 5;

          let html = `<span class="badge badge-${i}" data-count="${count}" />`;
        
          return new L.DivIcon({
            html: html,
            className: 'cluster-icon',
            iconSize: new L.point(Const.CLUSTER_SIZE, Const.CLUSTER_SIZE),
            iconAnchor: [Const.CLUSTER_SIZE / 2, Const.CLUSTER_SIZE]
          });
        }
      });
      this.cluster.on('clusterclick', (e) => this.onClusterClick(e));
      this.map.addLayer(this.cluster);
    }
    else {
      this.cluster.clearLayers();
    }

    this.cluster.addLayers(this.markers);
  }

  onMarkerClick(e) {
    let news = this.news[e.target.options.index];
    news.category = this.findName(this.categories, news.categoryId);
    news.publisher = this.findName(this.publishers, news.publisherId);

    // open popup
    this.dialog.open(MarkerComponent,
      { data: news, panelClass: 'speech-bubble', autoFocus: false }
    );
    this.map.panTo(L.latLng(news.latitude, news.longitude), { duration: Const.ANIMATION_DURATION });

    // update icon
    if(!news.isRead) {
      let icon = L.icon(Const.READ_ICON);
      e.target.setIcon(icon);
      news.isRead = true;
    }
  }

  onClusterClick(e) {
    let list: News[] = [];
    for(let marker of e.layer.getAllChildMarkers()) {
      let news = this.news[marker.options.index];
      news.category = this.findName(this.categories, news.categoryId);
      news.publisher = this.findName(this.publishers, news.publisherId);
      list.push(news);
    }
    let categories = this.categories.filter(c => list.some(l => l.categoryId == c.id));
    this.dialog.open(ClusterComponent,
      { data: { news: list, categories: categories } , panelClass: 'speech-bubble', autoFocus: false }
    );
    this.map.panTo(L.latLng(list[0].latitude, list[0].longitude), { duration: Const.ANIMATION_DURATION });
  }

  findName(list: Filter[], id: number): string {
    return list.find(x => x.id == id).name;
  }

  openFilter() {
    let data = new FilterData(this.categories, this.publishers, this.keywords);
    const dialogRef = this.dialog.open(FilterComponent,
      { data: data, autoFocus: false }
    );
    dialogRef.afterClosed().subscribe(filter => {
      if(filter && filter.categories != null && filter.publishers != null) {
        this.categories.forEach(c => c.selected = filter.categories.some(f => c.id == f));
        this.publishers.forEach(p => p.selected = filter.publishers.some(f => p.id == f));
        this.keywords = filter.keywords;
        this.applyFilter();
        // save cookie
        this.cookieService.set(Const.CATEGORY_COOKIE, filter.categories.join(Const.COOKIE_SEPARATOR));
        this.cookieService.set(Const.PUBLISHER_COOKIE, filter.publishers.join(Const.COOKIE_SEPARATOR));
      }
    });
  }

  applyFilter() {
    let news = this.news.filter(n => 
      this.categories.some(c => c.selected && c.id == n.categoryId) &&
      this.publishers.some(p => p.selected && p.id == n.publisherId)
    );
    if(this.keywords.length > 0) {
      news = news.filter(n => 
        this.keywords.some(k => n.description.toLowerCase().includes(k.toLowerCase())) ||
        this.keywords.some(k => n.title.toLowerCase().includes(k.toLowerCase()))
      );
    }
    this.initMarkers(news);
    this.initCluster();
  }

  openSettings() {
    let data = new SettingsData(this.defaultLocation, this.defaultZoom);
    const dialogRef = this.dialog.open(SettingsComponent,
      { data: data, autoFocus: false }
    );
    dialogRef.afterClosed().subscribe(settings => {
      if(settings != null) {
        this.defaultLocation = settings.location != null ? settings.location : Const.DEFAULT_LOCATION;
        this.defaultZoom = settings.zoom != null ? settings.zoom : Const.DEFAULT_ZOOM;
        this.setDefaultView();
        // save cookie
        this.cookieService.set(Const.LOCATION_COOKIE,
          this.defaultLocation.id.toString()
            .concat(Const.COOKIE_SEPARATOR + this.defaultLocation.latitude)
            .concat(Const.COOKIE_SEPARATOR + this.defaultLocation.longitude)
        );
        this.cookieService.set(Const.ZOOM_COOKIE, this.defaultZoom.toString());
      }
    });
  }

  openInfo() {
    this.dialog.open(InfoComponent, { autoFocus: false });
  }

  @HostListener('window:unload')
  saveRead() {
    let read = this.news.filter(n => n.isRead);
    if(read.length > 0) {
      this.cookieService.set(Const.VERSION_COOKIE, read[0].versionNo.toString());
      this.cookieService.set(Const.READ_COOKIE, read.map(r => r.id).join(Const.COOKIE_SEPARATOR));
    }
  }

  checkRead() {
    if(this.cookieService.check(Const.READ_COOKIE) && +this.cookieService.get(Const.VERSION_COOKIE) == this.news[0].versionNo) {
      let read = this.cookieService.get(Const.READ_COOKIE).split(Const.COOKIE_SEPARATOR);
      read.forEach(r => this.news.find(n => n.id == +r).isRead = true);
    }
    else {
      this.cookieService.delete(Const.READ_COOKIE);
      this.cookieService.delete(Const.VERSION_COOKIE);
    }
  }

  openParam(news: News) {
    // out of date
    if(news == null) {
      this.snackBar.open('❌ This news is out of date.', null, { duration: Const.NOTIFICATION_DURATION });
      return;
    }

    news.category = this.findName(this.categories, news.categoryId);
    news.publisher = this.findName(this.publishers, news.publisherId);

    // open popup
    this.dialog.open(MarkerComponent,
      { data: news, panelClass: 'speech-bubble', autoFocus: false }
    );
    this.map.panTo(L.latLng(news.latitude, news.longitude), { duration: Const.ANIMATION_DURATION });

    // archived
    if(news.versionNo < this.news[0].versionNo) {
      this.snackBar.open('⚠️ This news is archived.', null, { duration: Const.NOTIFICATION_DURATION });
    }
  }

}