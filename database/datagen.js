const faker = require('faker');
const _ = require('underscore');
const Aerospike = require('aerospike');
// const elastic = require('./elasticsearch');

// elastic.indexExists().then(function (exists) {  
//   if (exists) { 
//     return elastic.deleteIndex(); 
//   } 
// }).then(elastic.initIndex());

// elastic.initIndex();
// elastic.deleteIndex();
// elastic.initMapping()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const randomWarehouse = () => {
  let warehouses = [{ name: 'San Fransico', latitude: 37.775, longitude: -122.419 }, { name: 'Chicago', latitude: 41.878, longitude: -87.629 }, { name: 'Austin', latitude: 30.267, longitude: -97.743 }, { name: 'Miami', latitude: 25.762, longitude: -80.192 }, { name: 'New York', latitude: 40.713, longitude: -74.006 }];
  const array = [];
  warehouses = _.shuffle(warehouses);
  const amount = Math.round((Math.random() * 4) + 1);
  for (let i = 0; i < amount; i += 1) {
    array.push(warehouses[i]);
  }
  return array;
};

const primeBias = (height, length, width, weight) => {
  let beta = 1;
  if(height > 3000 || length > 3000 || width > 3000) {
    return 0;
  } else if(height > 1000 || length > 1000 || width > 1000) {
    beta -= .15;
  }
  if(weight > 25) {
    return 0;
  } else if(weight > 10) {
    beta -= .1;
  }
  beta_right = (beta > 0.5) ? 2*beta-1 : 2*(1-beta)-1;
  var roundOrFloor = Math.random();
  let primeeligible = false;
  if (roundOrFloor > .75) {
    primeeligible = Math.floor(beta_right);
  } else {
    primeeligible = Math.round(beta_right);
  }
  return primeeligible;
};

let count = 8340229;
let bool = true;
const insertMany = (client, counter) => {
  count++;
  if(count === 4) {
    bool = false;
    count = 0;
  } else {
    bool = true;
  }
  const product = {
    p_id: counter,
    name: faker.commerce.productName(),
    price: parseFloat(Number(Math.random() * 100).toFixed(2)),
    primeeligible: bool.toString(),
    weight: parseFloat(Number(Math.random() * 30).toFixed(2)),
    height: parseFloat(Number(Math.random() * 4500).toFixed(2)),
    length: parseFloat(Number(Math.random() * 4500).toFixed(2)),
    width: parseFloat(Number(Math.random() * 4500).toFixed(2)),
    warehouses: randomWarehouse(),
  };

  const quantity = {
    quantity: parseFloat(Number(Math.random() * 4500).toFixed(2)),
  };
  const key1 = new Aerospike.Key('inventory', 'products', counter);
  const key2 = new Aerospike.Key('inventory', 'quantity', counter);
  client.put(key1, product, (error, key) => {
    if (error && error.code !== Aerospike.status.AEROSPIKE_OK) {
      console.log('1',error);
    } else {
      client.put(key2, quantity, (error, key) => {
        if (error && error.code !== Aerospike.status.AEROSPIKE_OK) {
          console.log('2',error);
        } else {
          console.log(counter);
          if(counter < 10000000) {
            insertMany(client, counter + 1);
          }
        }
      });
    }
  });


  //   const insert = [];
//   const update = [];
//   let info = [];
//   const quer = 'INSERT INTO test (p_id, name, price, primeeligible, weight, height, width, length, warehouses) VALUES (?,?,?,?,?,?,?,?,?)';
//   const quer2 = 'UPDATE quantity SET quantity = quantity + ? WHERE p_id = ?;';
//   let boolean = true;
//   for (let i = 0; i < 100; i += 1) {
//     var index = counter + i + 1;
//     info = [
//       index, 
//       faker.commerce.productName(),
//       parseFloat(Number(Math.random() * 4500).toFixed(2)),
//       boolean,
//       parseFloat(Number(Math.random() * 4500).toFixed(2)),
//       parseFloat(Number(Math.random() * 100).toFixed(2)),
//       parseFloat(Number(Math.random() * 30).toFixed(2)),
//       parseFloat(Number(Math.random() * 4500).toFixed(2)),
//       randomWarehouse(),
//     ];
//     info[3] = primeBias(info[1], info[2], info[7], info[6]);
//     insert.push({ query: quer, params: info });
//     update.push({ query: quer2, params: [Math.floor(Math.random() * 3000), info[0]]});
//   }
//   client.batch(insert, { prepare: true })
//     .then(() => {
//       if (counter + 100 < 10000000) {
//         console.log(counter + 100);
//         client.batch(update, { prepare: true, counter: true})
//           .then(() => {
//             insertMany(client, counter + 100);
//         });
//       }
//     })
//     .catch((err) => { console.log(err); });
};


const clearDB = (client) => {
  const query = 'TRUNCATE products';
  client.execute(query)
    .then(result => console.log(result)).catch((err) => { console.log(err); });
};

module.exports = { insertMany, clearDB };