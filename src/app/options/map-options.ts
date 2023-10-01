import { environment } from 'src/environments/environment';

export const MAP_OPTIONS = {
  attribution: `<a href="https://www.mapbox.com/">Mapbox</a>
  | <a href="assets/static/terms.html" target="_blank">Terms &amp; Conditions</a>
  | <a href="assets/static/privacy.html" target="_blank">Privacy Policy</a>`,
  maxZoom: 9,
  minZoom: 4,
  noWrap: true,
  detectRetina: true,
  bounds: [[-180, -180],[180,180]],
  accessToken: environment.accessToken
};

export class MapUtils {
  
  static defineCluster(count: number) {
    if (count < 10) return 1;
    else if (count < 50) return 2;
    else if (count < 100) return 3;
    else if (count < 250) return 4;
    else return 5;
  }

}