const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/cart', (req, res) => {

});

app.set('/inventory', (req, res) => {

});

app.get('/price', (req, res) => {
  
  });
  

app.listen(3000, () => console.log('Example app listening on port 3000!'));