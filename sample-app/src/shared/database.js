const AWS = require("aws-sdk");
const cuid = require("cuid");

const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  apiVersion: "2012-08-10",
});

const DEFAULT_PARAMS = {
  TableName: process.env.TASKS_TABLE_NAME,
};

class Database {
  static async addTask(task) {
    const createdAt = new Date();
    const id = cuid();
    const newTask = {
      pk: "task",
      sk: id,
      id,
      task,
      createdAt: createdAt.toISOString(),
    };
    return await docClient.put({ ...DEFAULT_PARAMS, Item: newTask }).promise();
  }

  static async deleteTask(taskId) {
    return await docClient
      .delete({ ...DEFAULT_PARAMS, Key: { pk: "task", sk: taskId } })
      .promise();
  }

  static async listTasks() {
    const queryResp = await docClient
      .query({
        ...DEFAULT_PARAMS,
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": "task" },
        ScanIndexForward: false,
      })
      .promise();
    return queryResp?.Items || [];
  }
}

module.exports = { Database };
