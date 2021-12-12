const AWS = require('aws-sdk');
const cuid = require('cuid');

const docClient = new AWS.DynamoDB.DocumentClient({
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
    apiVersion: '2012-08-10',
});

const DEFAULT_PARAMS = {
    TableName: process.env.TASKS_TABLE_NAME,
};

const Database = {
    addTask: async function (task) {
        const createdAt = new Date();
        const id = cuid();
        const newTask = {
            pk: 'task',
            sk: id,
            id,
            task,
            createdAt: createdAt.toISOString(),
        };
        await docClient.put({ ...DEFAULT_PARAMS, Item: newTask }).promise();
    },
    deleteTask: async function (taskId) {
        await docClient
            .delete({ ...DEFAULT_PARAMS, Key: { pk: 'task', sk: taskId } })
            .promise();
    },
    listTasks: async function () {
        const queryResp = await docClient
            .query({
                ...DEFAULT_PARAMS,
                KeyConditionExpression: 'pk = :pk',
                ExpressionAttributeValues: { ':pk': 'task' },
                ScanIndexForward: false,
            })
            .promise();
        return queryResp?.Items || [];
    },
};

module.exports = { Database };
