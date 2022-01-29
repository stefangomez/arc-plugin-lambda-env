const { toLogicalID } = require('@architect/utils');

module.exports = {
    deploy: {
        start: function ({ arc, cloudformation: cfn }) {
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
                    console.log(resource.Properties.Environment.Variables);
                    resource.Properties.Environment.Variables = { ...resource.Properties.Environment.Variables, ...envVarsToAdd };
                }
            });
            return cfn;
        }
    },
    set: {
        env: function (inv) {
            const { arc } = inv.inventory.inv._project;
            const appName = arc['app'][0];
            const lambdaEnvVars = arc['lambda-env-vars'] || [ {} ];
            // TODO: handle more than just `tables`
            // TODO: dry up reused code below
            const { tables } = lambdaEnvVars[0] || {};
            let envVars = {};
            if (tables) {
                Object.keys(tables).forEach(tableName => {
                    const envVarName = tables[tableName];
                    envVars[envVarName] = `${appName}-staging-${tableName}`;
                });
            }
            return envVars;
        }
    },
    sandbox: {
        start: function (inv, callback) {
            const testingVars = inv.inventory.inv._project.env.local.testing;
            const tablesPort = Number(process.env.ARC_TABLES_PORT) || 5000;
            testingVars['DYNAMODB_ENDPOINT'] = `http://localhost:${tablesPort}`;
            if (callback) callback();
        },
    },
};
