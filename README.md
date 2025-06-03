# Guess Where?

An interactive geo quiz game app. This repository hosts the uncompiled code. The games is inspired from a [geo quiz by Telegraph](http://www.telegraph.co.uk/travel/citybreaks/11825481/Quiz-Can-you-identify-these-cities.html) that used a collection of static images. Visit the website and test your geo skills at [https://guess-where.pages.dev](https://guess-where.pages.dev)

## Contribute / Get involved

Fork the repository to contribute, get involved or make your own version out of it. You will need your own [Google API Browser Key](https://console.developers.google.com/) for it though.

The project is setup using [Vite](https://vite.dev/). Development Workflow requires Node. Use following steps to setup a development environment:

### Setup and install dependencies:

```sh
$ export VITE_GOOGLE_MAPS_API_KEY={google_maps_api_key}
$ npm install
```

### Run the application locally:

```sh
$ npm run dev
```

This will compile the list of countries and start the app at http://localhost:5173/

### Update countries dataset

> NB: it makes batched requests to Google Maps Geocode API

```sh
$ npm run prep-data
```

## Bugs reporting

Feature requests or bugs can be reported in the GitHub [issue tracker](https://github.com/jabranr/guess-where/issues)

## License

MIT License - [Jabran Rafique](https://www.jabran.me) | [@jabranr](https://twitter.com/jabranr)
