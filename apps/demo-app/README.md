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
docker run -it --rm -p 8080:8080 \
  --env APP_CONFIG="$(cat ./secrets/demo-app-config-development.json)" \
  --env DEBUG="demo-app*" \
  --env GITHUB_OAUTH_APP="$(cat ./secrets/github-oauth-app.json)" \
  --env GITHUB_TOKEN="$(cat ./secrets/github-token.txt)" \
  --env GOOGLE_OAUTH_APP="$(cat ./secrets/google-oauth-app.json)" \
  --env NODE_ENV=development \
  --env TELEGRAM="$(cat ./secrets/telegram.json)" \
  matsuri-demo-app:latest
```

## Deploy

Deploy the application as a Cloud Run service:

```sh
npx turbo run deploy --filter demo-app
```

## Test

If you want to test the app during development, set `DEMO_APP_URL` to `http://localhost:8080`.

If you want to test the app deployed on Cloud Run, set `DEMO_APP_URL` to the Cloud Run URL.

Make requests to the app:

```sh
curl "$DEMO_APP_URL/protected" \
  -X GET \
  -i
```

Make a GET request to a route that always respond with an error. This is useful to test whether the [hapi-github-issue-plugin](../../packages/hapi-github-issue-plugin/README.md) and the [hapi-telegram-plugin](../../packages/hapi-telegram-plugin/README.md) are configured correctly.

If you don't add a query string, `/error` alwasys returns HTTP 500 (internal server error).

```sh
curl "$DEMO_APP_URL/error" \
  -X GET | jq
```

You can specify a query string to have the app return a different error.

```sh
curl "$DEMO_APP_URL/error?error=not-found" \
  -X GET | jq

curl "$DEMO_APP_URL/error?error=teapot" \
  -X GET | jq

curl "$DEMO_APP_URL/error?error=too-many-requests" \
  -X GET | jq
```
