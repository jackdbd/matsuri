# @jackdbd/demo-app

Hapi application to showcase the usage of several Hapi plugins.

## Development

### Non-containerized application

Start the application (development environment):

```sh
npm run start:development -w packages/demo-app
```

*Note*: no need to build the app because I am using [tsm](https://github.com/lukeed/tsm).

### Containerized application

Build the container image:

```sh
npm run container:build -w packages/demo-app
```

Start the application:

```sh
npm run container:run:development -w packages/demo-app
```

## Deploy

Deploy the application as a Cloud Run service:

```sh
npm run deploy -w packages/demo-app
```

## Usage (TODO)

Make requests to the app:

```sh
curl -X GET \
  -L "$DEMO_APP_URL/protected" \
  -i
```
