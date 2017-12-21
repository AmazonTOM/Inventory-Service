const client = Aerospike.client(aerospikeConfig)
// Establish connection to the cluster
exports.connect = function (callback) {
  client.connect(callback);
}
// Write a record
exports.writeRecord = function (k, v, callback) {
  let key = new Aerospike.Key(aerospikeDBParams.defaultNamespace, aerospikeDBParams.defaultSet, k);
  client.put(key, { greet: v }, function (error) {
    // Check for errors
    if (error) {
      // An error occurred
      return callback(error);
    } else {
      return callback(null, 'ok');
    }
  });
}
// Read a record
exports.readRecord = function (k, callback) {
  let key = new Aerospike.Key(aerospikeDBParams.defaultNamespace, aerospikeDBParams.defaultSet, k)
  client.get(key, function (error, record) {
  // Check for errors
    if (error) {
        // An error occurred
        return callback(error)
    } else {
        let bins = record.bins
        return callback(null, k + ' ' + bins.greet)
    }
  });
}