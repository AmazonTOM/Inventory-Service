const cassandra = require('cassandra-driver');
const db = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'inventory'});
db.connect((err, results) => {
  console.log('Cassandra connected!!')
});

const queryAllInventory = 'SELECT * FROM products';
const queryStoreProduct = 'INSERT INTO products (id, name, price, primeeligible, quantity, warehouse, weight, width, height, length, latitude, longitude) VALUES(now(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

const getAllInventory = () => {
  return db.execute(queryAllInventory);
};
const storeProduct = (product) => {
  return db.execute(queryStoreProduct, [ 1,1,1,1,1,1,1,1,1,1,1 ], {prepare: true});
};

module.exports.getAllInventory = getAllInventory;
module.exports.storeProduct = storeProduct;