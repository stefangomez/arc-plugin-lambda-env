# arc-plugin-lambda-env

> Arc serverless framework (arc.codes) plugin for adding env variables to your lambdas from architect created resources

This plugin will add environment variables with logical names of resources created by your `.arc` schema.

Initial support only for `@tables` (dynamodb table names)

## Install

```bash
npm i --save-dev arc-plugin-lambda-env
```

## Usage

After installing add `@plugins` and `@lambda-env-vars` pragmas to your `app.arc` file:

`app.arc`

```arc
@app
myapp
@http
get /
@tables
mytable
  pk *String
  sk **String
tabletwo
  pk *String
  sk **String
@lambda-env-vars
tables
  mytable MY_APP_TABLE_NAME
  tabletwo TABLE_TWO_NAME
@plugins
arc-plugin-lambda-env
```

### Options

This plugin supports the following options under the `@lambda-env-vars` pragma:

|Option|Description|Example|
|---|---|---|
|`tables`| A list of tablename => ENV_VAR_NAME to be added to every lambda in your app|<code>tables<br>&nbsp;&nbsp;tablename ENV_VAR_NAME</code>|

### Sandbox

Running `arc sandbox` will run your lambdas locally with the correct env variables defined.

## Sample Application

There is a sample application located under `sample-app/`. `cd` into that
directory, `npm install` and you can run locally via `arc sandbox` or deploy to
the internet via `arc deploy`.

## ⚠️ Known Issues

### Only @tables (dynamodb) supported
I'll be adding support for injecting other resources identifiers as environment variables to your lambdas like `@events` (sns) and `@queues` (sqs).

### Can't target specific lambdas
As of now, declared env variables go to all lambda functions. Would be nice to specify which lambdas get which env variables added.

## Other Ideas

### Config file vs ENV Vars
It might be nicer to write a config file, probably in the universal `json`, on build/deploy that can be imported in specified lambdas rather than using environment variables.