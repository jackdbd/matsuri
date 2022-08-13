# Service accounts

Useful links:

- [Service Accounts predefined IAM roles](https://cloud.google.com/iam/docs/understanding-roles#service-accounts-roles).

## sa-matsuri-demo-app

```sh
gcloud iam service-accounts create sa-matsuri-demo-app \
  --display-name "Matsuri demo-app SA" \
  --description "SA for the demo-app in the Matsuri monorepo" \
  --project $GCP_PROJECT_ID
```
