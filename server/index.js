require('newrelic');
const express = require('express');
const parser = require('body-parser');
const Promise = require("bluebird");
const redis = require("redis");
const cache = redis.createClient();
const { checkInventory, updateInventory, generate, clearDB } = require('../database/index.js');

Promise.promisifyAll(redis.RedisClient.prototype);
  
cache.on("error", function (err) {
  console.log("Error " + err);
});

const port = process.env.PORT || 8080;
const app = express();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.patch('/products/:product_id/quantity', (req, res) => {
  let queries = [];
  for(let i = 0; i < req.body.cart.length; i++) {
    queries.push(cache.getAsync(req.body.cart[i].product_id.toString()).then((result) => {
      console.log('response',  result);
      if(result > 0) {
       return [req.body.cart[i].product_id, true];
      } else {
        return [req.body.cart[i].product_id, false];
      }
    }))
  }
  Promise.all(queries)
    .then((result) => {
      res.send(result);
    });
  // client.get(, function(error, result) {
  //   if (result) {
  //     res.send({ "totalStars": result, "source": "redis cache" });
  //   } else {
  //     getUserRepositories(username)
  //       .then(computeTotalStars)
  //       .then(function(totalStars) {
  //         // store the key-value pair (username:totalStars) in our cache
  //         // with an expiry of 1 minute (60s)
  //         client.setex(username, 60, totalStars);
  //         // return the result to the user
  //         res.send({ "totalStars": totalStars, "source": "GitHub API" });
  //         }).catch(function(response) {
  //           if (response.status === 404){
  //             res.send('The GitHub username could not be found. Try "coligo-io" as an example!');
  //           } else {
  //             res.send(response);
  //           }
  //       });
  //   }
    
  // });
  // // var bool = checkInventory(req.body.cart);
  // // console.log(bool);
  // // if(bool) {
  // //   updateInventory(req.body.cart).then((result) => {
  // //     res.send(result);
  //   });
  //   res.send();
  // }
  // res.send();
});

app.listen(port);
console.log('server started on port ', port);

