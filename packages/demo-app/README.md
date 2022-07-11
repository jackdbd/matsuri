# @jackdbd/demo-app

Hapi application to test and showcase the usage of several Hapi plugins.

## Run the app

Start the application (development environment):

```sh
npm run start:development -w packages/demo-app
```

Note: no need to build the app because I am using [tsm](https://github.com/lukeed/tsm).

Make requests to the app:

```sh
curl -X GET http://localhost:8080/hello

curl -X GET http://localhost:8080/broken?error=internal

curl -X GET http://localhost:8080/broken?error=method-not-allowed

curl -X GET http://localhost:8080/broken?error=not-accetable

curl -X GET http://localhost:8080/broken?error=not-found

curl -X GET http://localhost:8080/broken?error=not-implemented
```