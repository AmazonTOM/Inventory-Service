const mongoose = require('./index');

const InventorySchema = mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  primeEligible: String,
});

var inventory = mongoose.model('inventory', InventorySchema);

const saveProduct = (product) => {
  new inventory(product).save((err, inventory) => {
    if (err) return console.error(err);
    console.log('saved product to the DB');
  });
};

const getProduct = (id) => {
  return inventory.findOne({ id });
};