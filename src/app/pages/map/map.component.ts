import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener, isDevMode } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NewsService } from 'src/app/service/news.service';
import { MapUtils, MAP_OPTIONS } from 'src/app/options/map-options';
import * as Const from 'src/app/options/const-options';
import { MarkerComponent } from 'src/app/pages/marker/marker.component';
import { ClusterComponent } from 'src/app/pages/cluster/cluster.component';
import { FilterComponent } from 'src/app/pages/filter/filter.component';
import { InfoComponent } from 'src/app/pages/info/info.component';
import { CookieComponent } from 'src/app/pages/cookie/cookie.component';
import { Category } from 'src/app/model/category';
import { Publisher } from 'src/app/model/publisher';
import { News } from 'src/app/model/news';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { FilterableModel } from 'src/app/model/base';
import { FeedService } from 'src/app/service/feed.service';
import { Feed } from 'src/app/model/feed';
import { FilterPayload } from 'src/app/model/dialog';

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

  feeds: Feed[] = [];
  categories: Map<Number, Category> = new Map();
  publishers: Map<Number, Publisher> = new Map();
  newsList: News[] = [];

  readIds: Set<Number> = new Set();
  keywords: string[] = [];

  constructor(
    private feedService: FeedService,
    private newsService: NewsService,
    private cookieService: CookieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initMap();
    this.feedService.fetch().subscribe(feeds => {
      this.feeds = feeds;
      this.init(feeds);
    });

    this.route.paramMap.subscribe(params => {
      let id = +params.get('id');
      if(id) {
        this.newsService.get(id).subscribe(n => this.openParam(n));
      }
    });

    this.showCookieNotification();
  }

  initMap() {
    this.map = L.map('map');
    L.tileLayer(Const.MAP_API, MAP_OPTIONS).addTo(this.map);
    L.easyButton('<i class="fas fa-filter"></i>', () => this.openFilter()).addTo(this.map);
    L.easyButton('<i class="fas fa-info"></i>', () => this.openInfo()).addTo(this.map);
    this.map.setView([Const.DEFAULT_LATITUDE, Const.DEFAULT_LONGITUDE], Const.DEFAULT_ZOOM);
  }

  recoverReadNews() {
    let readNewsCookie = this.cookieService.get(Const.READ_NEWS_COOKIE);

    if (readNewsCookie) {
      try {
        let readIds: number[] = JSON.parse(readNewsCookie);
        this.readIds = new Set(readIds);
      } catch (err) {
        if (isDevMode()) {
          console.log(err);
        }
      }
    }
  }

  init(feeds: Feed[]) {
    for (let feed of feeds) {
      this.categories.set(feed.category.id, feed.category);
      this.publishers.set(feed.publisher.id, feed.publisher);
    }

    for (let category of this.categories.values()) {
      this.categories.set(category.id, new Category(category));
    }
    for (let publisher of this.publishers.values()) {
      this.publishers.set(publisher.id, new Publisher(publisher));
    }

    this.recoverReadNews();
    this.initNews(feeds);
  }

  initNews(feeds: Feed[]) {
    this.newsList = [];
    for (let feed of feeds) {
      for (let news of feed.newsList) {
        news.categoryId = feed.category.id;
        news.publisherName = feed.publisher.name;
        news.index = this.newsList.length;
        news.isRead = this.readIds.has(news.id);

        this.newsList.push(news);
      }
    }

    this.initMarkers();
    this.initCluster();
  }

  initMarkers() {
    this.markers = [];

    let unreadIcon = L.icon(Const.UNREAD_ICON);
    let readIcon = L.icon(Const.READ_ICON);

    for (let news of this.newsList) {
      this.markers.push(
        L.marker(
          [news.location.latitude, news.location.longitude],
          {
            icon: news.isRead ? readIcon : unreadIcon,
            index: news.index
          }
        ).on('click', (e) => this.onMarkerClick(e))
      );
    }
  }

  initCluster() {
    if (this.cluster == null) {
      this.cluster = new L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
          let count = cluster.getChildCount();
          let i = MapUtils.defineCluster(count);
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
    } else {
      this.cluster.clearLayers();
    }

    this.cluster.addLayers(this.markers);
  }

  onMarkerClick(e) {
    let news = this.newsList[e.target.options.index];

    // open popup
    this.dialog.open(MarkerComponent,
      { data: news, panelClass: 'speech-bubble', autoFocus: false }
    );
    this.map.panTo(L.latLng(news.location.latitude, news.location.longitude), { duration: Const.ANIMATION_DURATION });

    // update icon
    if (!news.isRead) {
      let icon = L.icon(Const.READ_ICON);
      e.target.setIcon(icon);
      news.isRead = true;
    }
  }

  onClusterClick(e) {
    let categoryMap: Map<Number, Category> = new Map();
    for (let marker of e.layer.getAllChildMarkers()) {
      var news = this.newsList[marker.options.index];
      let category = categoryMap.get(news.categoryId);

      if (category == null) {
        categoryMap.set(news.categoryId, this.categories.get(news.categoryId));
        category = categoryMap.get(news.categoryId);
        category.newsList = [];
      }
      category.newsList.push(news);
    }

    let categories = [...categoryMap.values()];

    this.dialog.open(ClusterComponent,
      { data: categories, panelClass: 'speech-bubble', autoFocus: false }
    );
    this.map.panTo(L.latLng(news.location.latitude, news.location.longitude), { duration: Const.ANIMATION_DURATION });
  }

  openFilter() {
    let categories = [...this.categories.values()];
    let publishers = [...this.publishers.values()];
    let data = new FilterPayload(categories, publishers, this.keywords);
    const dialogRef = this.dialog.open(FilterComponent,
      { data: data, autoFocus: false }
    );
    dialogRef.afterClosed().subscribe(filter => {
      if (filter instanceof FilterPayload) {
        this.syncVisibility(filter.categories, this.categories);
        this.syncVisibility(filter.publishers, this.publishers);
        this.keywords = filter.keywords;
        this.applyFilters();
      }
    });
  }

  syncVisibility(source: FilterableModel[], target: Map<Number, FilterableModel>) {
    for (let entry of target.values()) {
      entry.visible = false;
    }
    for (let model of source) {
      target.get(model.id).visible = true;
    }
  }

  applyFilters() {
    let feeds = this.feeds.filter(f => 
      this.categories.get(f.category.id).visible &&
      this.publishers.get(f.publisher.id).visible
    );

    this.initNews(feeds);
  }

  openInfo() {
    this.dialog.open(InfoComponent, { autoFocus: false });
  }

  showCookieNotification() {
    if (!this.cookieService.check(Const.NOTIFICATION_COOKIE)) {
      this.snackBar.openFromComponent(CookieComponent).afterDismissed().subscribe(
        () => this.cookieService.set(Const.NOTIFICATION_COOKIE, 'notified', null, null, null, true)
      );
    }
  }

  @HostListener('window:beforeunload')
  saveReadNews() {
    let readNews = this.newsList.filter(n => n.isRead);
    if (readNews.length > 0) {
      this.cookieService.set(Const.READ_NEWS_COOKIE, JSON.stringify(readNews.map(r => r.id)), null, null, null, true);
    }
  }

  openParam(news) {
    // out of date
    if (news == null) {
      this.snackBar.open('❌ This news is out of date.', null, { duration: Const.NOTIFICATION_DURATION });
      return;
    } else {
      news.publisherName = news.publisher.name;
    }

    // open popup
    this.dialog.open(MarkerComponent,
      { data: news, panelClass: 'speech-bubble', autoFocus: false }
    );
    this.map.panTo(L.latLng(news.location.latitude, news.location.longitude), { duration: Const.ANIMATION_DURATION });

    /*
    // archived
    if (news.versionNo < this.newsList[0].versionNo) {
      this.snackBar.open('⚠️ This news is archived.', null, { duration: Const.NOTIFICATION_DURATION });
    }
    */
  }

}