# Setup for Secret Manager

Useful links:

- [Secret Manager predefined IAM roles](https://cloud.google.com/secret-manager/docs/access-control)

## Create secrets

Create a secret that contains the credentials for a [GitHub OAuth app](https://docs.github.com/en/developers/apps/getting-started-with-apps/about-apps):

```sh
gcloud secrets create MATSURI_DEMO_APP_GITHUB_APP \
  --data-file './secrets/matsuri-demo-app-github-app.json' \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=secret
```

Create a secret that contains the credentials for a [Twitter OAuth app](https://developer.twitter.com/en/docs/apps/overview):

```sh
gcloud secrets create MATSURI_DEMO_APP_TWITTER_APP \
  --data-file './secrets/matsuri-demo-app-twitter-app.json' \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=secret
```
