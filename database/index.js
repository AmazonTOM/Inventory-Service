const cassandra = require('cassandra-driver');
const generate = require('./datagen');
const db = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'inventory'});
db.connect((err, results) => {
  console.log('Cassandra connected!!')
});

const queryAllInventory = 'SELECT * FROM products';
const queryStoreProduct = 'INSERT INTO products (id, name, price, quantity, primeeligible, warehouse, height, length, width, weight, longitude, latitude) VALUES(now(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

const getAllInventory = () => {
  return db.execute(queryAllInventory);
};
const storeProduct = (product) => {
  console.log('in db', product);
  return db.execute(queryStoreProduct, product, {prepare: true});
};

const generateProducts = () => {
  generate(queryStoreProduct, db);
};

module.exports.getAllInventory = getAllInventory;
module.exports.storeProduct = storeProduct;
module.exports.generateProducts = generateProducts;
