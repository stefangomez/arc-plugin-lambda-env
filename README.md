# arc-plugin-lambda-env&nbsp;&nbsp;<a href="https://badge.fury.io/js/arc-plugin-lambda-env"><img alt="npm version" src="https://badge.fury.io/js/arc-plugin-lambda-env.svg"></a>

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

Running `arc sandbox` will run your lambdas locally with the correct env variables defined. In order to 
In sandbox, you'll need to write code to determine what the local dynamodb endpoint is. See an example in the [sample-app code](https://github.com/stefangomez/arc-plugin-lambda-env/blob/3d22b969fdfbade0952602b79539e0ea9e5ebb24/sample-app/src/shared/database.js#L4). Arc 10 adds a `ARC_SANDBOX` ENV variable containing a JSON string that can be parsed to find the locally running port in `ports.tables`. In deployed environments `ARC_SANDBOX` will be undefined and your clients should automatically connect to the right endpoint/region based on aws lambda injected vars.

## Sample Application

There is a sample application located under `sample-app/`. `cd` into that
directory, `npm install` and you can run locally via `npm start` or `npx arc sandbox` or deploy to
the internet via `npx arc deploy`.

## ⚠️ Known Issues

### Supported architect versions
This plugin will work for architect version `10.0.0-RC.2` and above. Please use version `0.1.0` of this plugin if you have architect version `9.0.2` or below. Any versions in between are currently not supported

### Only @tables (dynamodb) supported
I'll be adding support for injecting other resources identifiers as environment variables to your lambdas like `@events` (sns) and `@queues` (sqs).

### Can't target specific lambdas
As of now, declared env variables go to all lambda functions. Would be nice to specify which lambdas get which env variables added.

## Other Ideas

### Config file vs ENV Vars
It might be nicer to write a config file, probably in the universal `json`, on build/deploy that can be imported in specified lambdas rather than using environment variables.