const mongoose = require('mongoose');

const InventorySchema = mongoose.Schema({
  name: String,
  price: String,
  quantity: String,
  primeEligible: String,
});
 
const Inventory = mongoose.model('inventory', InventorySchema);

// new Inventory({
//   name: "toothpaste",
//   price: "3.00",
//   quantity: 3000000,
//   primeEligible: "yes",
// }).save((err, inventory) => {
//   if (err) return console.error(err);
//   console.log('saved product to the DB');
// });

const saveProduct = (product) => {
  new Inventory(product).save((err, inventory) => {
    if (err) return console.error(err);
    console.log('saved product to the DB');
  });
};

const getProduct = (id) => {
  return inventory.findOne({ id });
};