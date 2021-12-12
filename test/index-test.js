const plugin = require('../');
const { join } = require('path');
const inventory = require('@architect/inventory');
const pkg = require('@architect/package');
const fs = require('fs-extra');
const sampleDir = join(__dirname, '..', 'sample-app');
const appDir = join(__dirname, 'tmp');
const originalCwd = process.cwd();

describe('arc-plugin-lambda-env', () => {
    let inv = {};
    let arc = {};
    beforeAll(async () => {
        // Set up integration test directory as a copy of sample app
        const appPluginDir = join(appDir, 'node_modules', 'arc-plugin-lambda-env');
        const sampleAppSharedDir = join(appDir, 'node_modules', '@architect', 'shared');
        await fs.mkdirp(appPluginDir);
        await fs.mkdirp(sampleAppSharedDir);
        await fs.copy(join(sampleDir, 'app.arc'), join(appDir, 'app.arc'));
        await fs.copy(join(__dirname, '..', 'index.js'), join(appPluginDir, 'index.js'));
        await fs.copy(join(sampleDir, 'src', 'shared', 'database.js'), join(sampleAppSharedDir, 'database.js'));
        process.chdir(appDir);
        inv = await inventory({});
        arc = inv.inv._project.arc;
    });
    afterAll(async () => {
        process.chdir(originalCwd);
        await fs.remove(appDir);
    });
    describe('cloudformation packaging', () => {
        it('adds environment variable for sample-app ddb table name to lambda', () => {
            const cloudformation = pkg(inv);
            const result = plugin.package({ arc, cloudformation, inventory: inv });
            const lambdaEnvVarsObj = result.Resources.GetListTasksHTTPLambda.Properties.Environment.Variables;
            const lambdaEnvVars = Object.keys(lambdaEnvVarsObj);
            expect(lambdaEnvVars).toContain('TASKS_TABLE_NAME');
        });
    });
    describe('sandbox integration', () => {
        beforeAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
        });
        it('compiles function typescript code into JS on startup and removes compiled JS on shutdown', (done) => {
            plugin.sandbox.start({ arc }, (err) => {
                expect(err).toBeUndefined();
                expect(process.env.DYNAMODB_ENDPOINT).toBeDefined();
                expect(process.env.TASKS_TABLE_NAME).toEqual('sample-app-staging-tasks');
                done();
            });
        });
    });
});
