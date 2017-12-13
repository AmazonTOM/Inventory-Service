const express = require('express');
const app = express();
const db = require('../database/index');

// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'us-west-2' });

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/cart', (req, res) => {});

app.set('/inventory', (req, res) => {});

app.get('/price', (req, res) => {});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
