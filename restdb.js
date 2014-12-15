module.exports = function(app, db, collection_url) {
  var member_url = collection_url + "/:id";

  var getRecords, createRecord, findRecord, updateRecord, deleteRecord;
  var index, create, show, update, destroy;

  getRecords = function(cb) {
    db.find({}, function(err, records){
      if (err) {
        throw err;
      } else { 
        cb(records);
      }
    });
  };

  createRecord = function(data, cb) {
    db.insert(data, function(err, record){
      if (err) {
        throw err;
      } else { 
        cb(record);
      }
    });
  };

  findRecord = function(id, cb) {
    db.find({_id: id}, function(err, record){
      if (err) {
        throw err;
      } else { 
        cb(record);
      }
    });
  };

  updateRecord = function(id, record, cb) {
    db.update({_id: id}, record, {}, function(err, numUpdated){
      if (err) {
        throw err;
      } else { 
        cb(numUpdated);
      }
    });
  };

  deleteRecord = function(id, cb) {
    db.remove({_id: id}, {}, function(err, numRemoved){
      if (err) {
        throw err;
      } else { 
        cb(numRemoved);
      }
    });
  };


  index = function(req, res){
    getRecords(function(records){
      res.json(records);
    });
  };

  create = function(req, res){
    createRecord(req.body, function(record){
      res.json(record);
    });
  };

  show = function(req, res){
    findRecord(req.param("id"), function(record){
      res.json(record);
    });
  };

  update = function(req, res){
    updateRecord(req.param("id"), req.body, function(record){
      findRecord(req.param("id"), function(record){
        res.json(record);
      });
    });
  };

  destroy = function(req, res){
    deleteRecord(req.param("id"), function(record){
      res.status(200).end();
    });
  };

  app.get(collection_url, index);
  app.post(collection_url, create);
  app.get(member_url, show);
  app.put(member_url, update);
  app.delete(member_url, destroy);
}