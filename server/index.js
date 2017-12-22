// require('newrelic');
const express = require('express');
const parser = require('body-parser');
const Aerospike = require('aerospike');
const { insertMany } = require('../database/datagen');

// var AWS = require('aws-sdk');
// // Set the region 
// AWS.config.update({region: 'REGION'});

// // Create an SQS service object
// var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// var params = {
//  DelaySeconds: 10,
//  MessageAttributes: {
//   "Title": {
//     DataType: "String",
//     StringValue: "The Whistler"
//    },
//   "Author": { 
//     DataType: "String",
//     StringValue: "John Grisham"
//    },
//   "WeeksOn": {
//     DataType: "Number",
//     StringValue: "6"
//    }
//  },
//  MessageBody: "Fuck You AMMMMMMMMMMMMMMMMMMMMMMAN",
//  QueueUrl: "https://sqs.us-west-1.amazonaws.com/016977445519/IncecntiveProduct"
// };

// sqs.sendMessage(params, function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.MessageId);
//   }
// });


let config = {
  hosts: '127.0.0.1:3000'
}

const db = Aerospike.client(config);

db.connect(function (error) {
  if (error && error.code !== Aerospike.status.AEROSPIKE_OK) {
    console.log(error);
  } else {
    console.log('Aeorspike Connected!');
  }
});

const port = process.env.PORT || 8080;
const app = express();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.patch('/products/:product_id/quantity', (req, res) => {

  const keys = req.body.cart.map(item => {
    // console.log(Aerospike);
    return new Aerospike.Key('inventory', 'products', item.product_id.toString());
  });
  // console.log(keys);
  // keys.forEach((key, idx) => {
  //   const rec = {
  //     quantity: req.body.cart[idx].quantity,
  //   };
  //   db.put(key, rec, function (error, key) {
  //     if (error && error.code !== status.AEROSPIKE_OK) {
  //       // handle failure
  //     } else {
  //       // handle success
  //     }
  // });

  db.batchGet(keys, function (error, results) {
    if (error && error.code !== Aerospike.status.AEROSPIKE_OK) {
      console.log(error);
    } else {
      for (var i = 0; i < results.length; i++) {
        const result = results[i]
        switch (result.status) {
          case Aerospike.status.AEROSPIKE_OK:
            console.log(result);
            break
          case Aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND:
            console.log(Aerospike.status);
            break
          default:
            console.log('error');
            break
        }
      }
      res.send(results);
    }
  });
});

app.listen(port);
console.log('server started on port ', port);

insertMany(db, 0);


// let queries = [];
// let inventoryStatus = {
//   orderId: req.body.orderId,
//   status: {
//     success: [],
//     fail: [],
//   },
// };  
// for(let i = 0; i < req.body.cart.length; i++) {
//   queries.push(api.readRecord(req.body.cart[i].product_id.toString()).then((result) => {
//     // console.log('response',  result);

//     if(result === null) {
//       return checkInventory(req.body.cart[i])
//         .then((result) => {
//           api.writeRecord(req.body.cart[i].product_id.toString(), result.toString());
//           if(result - req.body.cart[i].quantity > 0) {
//             return [req.body.cart[i].product_id, true];
//           } 
//           return [req.body.cart[i].product_id, false];
//         });
//     } else if(result - req.body.cart[i].quantity > 0) {
//      return [req.body.cart[i].product_id, true];
//     } else {
//       return [req.body.cart[i].product_id, false];
//     }
//   })
//    .then((result) => {
//      return result;
//    }));
// }
// Promise.all(queries)
//   .then((result) => {
//     const inventoryStatus = {
//       order_id: req.body.order_id,
//       status: result,
//     };
//     updateInventory(req.body.cart);
//     res.send(inventoryStatus);
//   });

// const Promise = require("bluebird");
// const redis = require("redis");
// const cache = redis.createClient();
// Promise.promisifyAll(redis.RedisClient.prototype);
// cache.on("error", function (err) {
//   console.log("Error " + err);
// });