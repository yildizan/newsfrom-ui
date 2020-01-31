import { environment } from 'src/environments/environment';

export const MAP_OPTIONS = {
    attribution: `<a href="https://www.mapbox.com/">Mapbox</a>
    | <a href="assets/static/terms.html" target="_blank">Terms &amp; Conditions</a>
    | <a href="assets/static/privacy.html" target="_blank">Privacy Policy</a>`,
    maxZoom: 11,
    minZoom: 2,
    noWrap: true,
    detectRetina: true,
    bounds: [[-180, -180],[180,180]],
    accessToken: environment.accessToken
};