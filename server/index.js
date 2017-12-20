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
  let inventoryStatus = {
    orderId: req.body.orderId,
    status: {
      success: [],
      fail: [],
    },
  };  
  for(let i = 0; i < req.body.cart.length; i++) {
    queries.push(cache.getAsync(req.body.cart[i].product_id.toString()).then((result) => {
      // console.log('response',  result);

      if(result === null) {
        return checkInventory(req.body.cart[i])
          .then((result) => {
            cache.set(req.body.cart[i].product_id.toString(), result.toString());
            if(result - req.body.cart[i].quantity > 0) {
              return [req.body.cart[i].product_id, true];
            } 
            return [req.body.cart[i].product_id, false];
          });
      } else if(result > 0) {
       return [req.body.cart[i].product_id, true];
      } else {
        return [req.body.cart[i].product_id, false];
      }
    })
     .then((result) => {
       return result;
     }));
  }
  Promise.all(queries)
    .then((result) => {
      const inventoryStatus = {
        order_id: req.body.order_id,
        status: result,
      };
      updateInventory(req.body.cart);
      res.send(inventoryStatus);
    });
});

app.listen(port);
console.log('server started on port ', port);

