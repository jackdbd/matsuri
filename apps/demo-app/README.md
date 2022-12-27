# @jackdbd/demo-app

Hapi application to showcase the usage of several Hapi plugins.

## Development

### Non-containerized application

Start the application (development environment) on port `8080` (or on the environment variable `PORT`):

```sh
npm run demo-app:start:development
```

*Note*: no need to build the app because I am using [tsm](https://github.com/lukeed/tsm).

### Containerized application

Build the container image:

```sh
npm run demo-app:container:build
```

Start the application:

```sh
npm run demo-app:container:run:development
```

## Deploy

Deploy the application as a Cloud Run service:

```sh
npx turbo run deploy --filter demo-app
```

## Usage

Make requests to the app:

```sh
curl -X GET \
  -L "$DEMO_APP_URL/protected" \
  -i
```
