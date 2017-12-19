const redis = require("redis");
const cache = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});