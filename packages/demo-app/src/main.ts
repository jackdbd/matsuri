import { provision } from './provision.js'

provision(process.env).then(
  ({ app_human_readable_name, environment, port }) => {
    console.log(
      `Application "${app_human_readable_name}" provisioned for environment "${environment}" and ready to serve requests on port ${port}`
    )
  }
)
