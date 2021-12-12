@app
sample-app

@http
get /

@tables
mytable
  pk *String
  sk **String

@lambda-env-vars
tables
  mytable MY_APP_TABLE_NAME

@plugins
arc-plugin-lambda-env

@env
testing
  A_TESTING_ENV_VAR something-for-testing
  ANOTHER_VAR only-for-testing

staging
  A_STAGING_ENV_VAR something-for-staging

sandbox
  A_SANDBOX_ENV_VAR something-for-sandbox

production
  A_PRODUCTION_ENV_VAR something-for-production

@sandbox
no-hydrate true



# @aws
# profile default
# region us-west-1

