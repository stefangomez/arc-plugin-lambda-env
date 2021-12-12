const { Database } = require("@architect/shared/database");

// learn more about HTTP functions here: https://arc.codes/primitives/http
exports.handler = async function http(req) {
  const reqBody = JSON.parse(req.body);
  const task = await Database.addTask(reqBody.task);
  return {
    statusCode: 200,
    headers: {
      "cache-control":
        "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
      "content-type": "application/json",
    },
    body: JSON.stringify({ task }),
  };
};
