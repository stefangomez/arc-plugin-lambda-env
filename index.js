const { toLogicalID } = require('@architect/utils');

module.exports = {
    package: function ({ arc, cloudformation: cfn }) {
        const lambdaEnvVars = arc['lambda-env-vars'] || [ {} ];
        // TODO: handle more than just `tables`
        const { tables } = lambdaEnvVars[0] || {};
        const envVarsToAdd = {};
        if (tables) {
            Object.keys(tables).forEach(tableName => {
                const envVarName = tables[tableName];
                const cfnName = `${toLogicalID(tableName)}Table`;
                envVarsToAdd[envVarName] = { Ref: cfnName };
            });
        }
        const resourceKeys = Object.keys(cfn.Resources);
        resourceKeys.forEach(key => {
            const resource = cfn.Resources[key];
            if (resource.Type === 'AWS::Serverless::Function') {
                console.log(`processing function ${key}`);
                resource.Properties.Environment = resource.Properties.Environment || { Variables: {} };
                resource.Properties.Environment.Variables = { ...resource.Properties.Environment.Variables, ...envVarsToAdd };
            }
        });
        return cfn;
    },
    sandbox: {
        start: function ({ arc }, callback) {
            // TODO: try to have this generated from architect sandbox code.
            // Right now architect creates 'staging' and 'production' local tables
            //   - see: https://github.com/architect/sandbox/blob/main/src/tables/create-table/index.js#L13
            // but @architect/functions assumes sandbox env to mean the locally created 'staging' table
            //   - see: https://github.com/architect/functions/blob/main/src/tables/sandbox.js

            // TODO: handle multiple apps?
            const appName = arc['app'][0];
            const lambdaEnvVars = arc['lambda-env-vars'] || [ {} ];
            // TODO: handle more than just `tables`
            // TODO: dry up reused code below
            const { tables } = lambdaEnvVars[0] || {};
            if (tables) {
                Object.keys(tables).forEach(tableName => {
                    const envVarName = tables[tableName];
                    process.env[envVarName] = `${appName}-staging-${tableName}`;
                });
                const tablesPort = Number(process.env.ARC_TABLES_PORT) || 5000;
                process.env.DYNAMODB_ENDPOINT = `http://localhost:${tablesPort}`;
            }
            callback();
        },
    },
};
