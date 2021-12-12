@app
sample-app

@http
get /
get /list-tasks
post /add-task
post /delete-task

@tables
tasks
  pk *String
  sk **String

@lambda-env-vars
tables
  tasks TASKS_TABLE_NAME

@plugins
arc-plugin-lambda-env

# @aws
# profile default
# region us-west-1
