function docsToObjects(err, data, cb) {
  if (err) {
    cb(err, null);
  } else {
    // remove extra fields returned by Mongoose
    var retArray = [];
    for(var i = 0; i < data.length; ++i) {
      retArray.push(data[i].toObject());
    }
    cb(null, retArray);
  }
}

module.exports = {
  docsToObjects: docsToObjects
}
