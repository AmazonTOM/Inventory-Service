const cassandra = require('cassandra-driver');
const helper = require('./datagen');
const Promise = require("bluebird");

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'inventory' });

client.connect((err) => {
  if (err) {
    console.log('Cassandra connection failed!!');
  } else {
    console.log('Cassandra connected!!');
  }
});

const query = 'UPDATE quantity SET quantity = quantity - ? WHERE p_id = ?';
const check = 'SELECT quantity from quantity WHERE p_id = ? ALLOW FILTERING';
const clearDB = () => {
  helper.clearDB(client);
};
const generate = () => {
  helper.insertMany(client, 0);
};

const updateInventory = (cartItems) => {
  var queries = [];
  for(let i = 0; i < cartItems.length; i++) {
    queries.push({ query, params: [cartItems[i].quantity, cartItems[i].product_id] });
  }
  return client.batch(queries, { prepare: true, counter: true });
};

const checkInventory = (cartItems) => {
  var queries = [];
  for(let i = 0; i < cartItems.length; i++) {
    client.execute(check, [ cartItems[i].product_id ], { prepare: true })
    .then((result) => {
      // console.log(result.rows[0].quantity.low);
      if(result.rows[0].quantity.low - cartItems[i].quantity < 0) {
        console.log('wooo');
        throw false;
      }
    })
    .catch(result => result);
  }
};

module.exports = { generate, clearDB, updateInventory, checkInventory };
