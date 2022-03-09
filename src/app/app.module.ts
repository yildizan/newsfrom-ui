import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ClipboardModule } from 'ngx-clipboard';
import 'hammerjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { FeedService } from './service/feed.service';
import { NewsService } from './service/news.service';
import { MapComponent } from './pages/map/map.component';
import { MarkerComponent } from './pages/marker/marker.component';
import { ClusterComponent } from './pages/cluster/cluster.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { FilterComponent } from './pages/filter/filter.component';
import { InfoComponent } from './pages/info/info.component';
import { CookieComponent } from './pages/cookie/cookie.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MarkerComponent,
    ClusterComponent,
    SettingsComponent,
    FilterComponent,
    InfoComponent,
    CookieComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    ClipboardModule
  ],
  providers: [
    FeedService,
    NewsService,
    CookieService
  ],
  entryComponents: [
    MarkerComponent,
    ClusterComponent,
    SettingsComponent,
    FilterComponent,
    InfoComponent,
    CookieComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
