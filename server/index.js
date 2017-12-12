const express = require('express');
const app = express();
const db = require('../database/index');

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

var elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

app.get('/', (req, res) => {
  var product = {
    name: "toothpaste",
    price: "3.00",
    primeEligible: true,
    quantity: 30000000,
    warehouse: 'wooo',
    weight: 9,
    width: 100,
    height: 22,
    length: 12,
    latitude: 3.33,
    longitude: 111.11,
  };
  db.storeProduct(product);
});

app.get('/cart', (req, res) => {

});

app.set('/inventory', (req, res) => {

});

app.get('/price', (req, res) => {
  
});
  

app.listen(3000, () => console.log('inventory service app listening on port 3000!'));