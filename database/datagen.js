const faker = require('faker');

const generateBatch = (query, client) => {
  const arr = [];
  for(var i = 0; i < 100; i++) {
    var product = [faker.commerce.productName(), parseFloat(Number(Math.random()*100).toFixed(2)), Math.floor(Math.random()*3000), faker.random.boolean(), faker.address.state(), parseFloat(Number(Math.random()*4500).toFixed(2)), parseFloat(Number(Math.random()*4500).toFixed(2)), parseFloat(Number(Math.random()*4500).toFixed(2)), parseFloat(Number(Math.random()*30).toFixed(2)), Math.random()*20 + 30, -1* (Math.random()* 55 + 70)];
    console.log('in server', product);
    arr.push({ query, params: product })
  }
  client.batch(arr, { prepare: true })
    .then(() => console.log('data updated'))
      .catch((err) => console.log(err));
}

module.exports = generateBatch;
