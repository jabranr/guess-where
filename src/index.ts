!(function(root: any, document: Document, $: JQueryStatic, google: any, factory: Function) {
  root.GuessWhere = root.GuessWhere || factory(root, document, $, google);
  $(document).ready(GuessWhere.init);
})(this, document, jQuery, google, function(root: any, document: Document, $: JQueryStatic, google: any) {
  'use strict';

  const _app: AppInternal = {};

  const app: App = {
    fbscopes: 'email',
    iOS: (/iP(od|ad|hone)/).test(navigator.userAgent),
    android: (/(Android)/).test(navigator.userAgent)
  } as App;

  // ...existing code... (keep all function definitions the same, just add type annotations where needed)

  function setupGoogleMaps(lat?: number, lng?: number, zoom?: number, callback?: (map: google.maps.Map) => void) {
    // ...existing code...
  }

  function getJSON(url: string, data: any, success: (data: any) => void, error: (xhr: JQueryXHR, error: string) => void) {
    // ...existing code...
  }

  function setStyle(map: google.maps.Map, level: string) {
    // ...existing code...
  }

  function sortData(countries: Country[]) {
    // ...existing code...
  }

  function getRandomCountry(): CountryInfo | undefined {
    // ...existing code...
  }

  // ...existing code...

  app.init = init;
  return app;
});
