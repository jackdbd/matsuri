# Setup for Secret Manager

Useful links:

- [Secret Manager predefined IAM roles](https://cloud.google.com/secret-manager/docs/access-control)

## Create secrets

Create a secret that contains the configuration for the Matsuri demo app:

```sh
gcloud secrets create MATSURI_DEMO_APP_CONFIG_PRODUCTION \
  --data-file './secrets/demo-app-config-production.json' \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=secret
```

Create a secret that contains the credentials for a [GitHub OAuth app](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app):

```sh
gcloud secrets create MATSURI_DEMO_APP_GITHUB_OAUTH_APP \
  --data-file './secrets/github-oauth-app.json' \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=secret
```

Create a secret that contains the credentials for a [Google OAuth app](https://developers.google.com/identity/protocols/oauth2):

```sh
gcloud secrets create MATSURI_DEMO_APP_GOOGLE_OAUTH_APP \
  --data-file './secrets/google-oauth-app.json' \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=secret
```

Create a secret that contains the credentials for a [Twitter OAuth app](https://developer.twitter.com/en/docs/apps/overview):

```sh
gcloud secrets create MATSURI_DEMO_APP_TWITTER_OAUTH_APP \
  --data-file './secrets/twitter-oauth-app.json' \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=secret
```
