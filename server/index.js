const express = require('express');
const app = express();
const db = require('../database/index');
const faker = require('faker');

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

var elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

app.get('/', (req, res) => {
  db.generateProducts();
});

app.get('/cart', (req, res) => {

});

app.set('/inventory', (req, res) => {

});

app.get('/price', (req, res) => {
  
});
  

app.listen(3000, () => console.log('inventory service app listening on port 3000!'));