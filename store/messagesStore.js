const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
//const url  = 'mongodb://localhost:27017/';
const dotenv = require('dotenv');
dotenv.config();
const logger = require('heroku-logger');
const messageCollection = 'messages';

const dbName = process.env.MONGODB_NAME;
const url  = process.env.MONGODB_URI;
const store = {

  get(callback) {
      MongoClient.connect(url, (err, client) => {
        if (err) {
          throw err;
        }
        const db = client.db(dbName);

        db.collection(messageCollection).find({}).toArray(function(error, docs) {
            if (err) {
              throw error;
            }
            callback(docs);
        });
      })
    },

  add(message) {
    MongoClient.connect(url, (err, client) => {
      if (err) {
        throw err;
      }
      const db = client.db(dbName);
      db.collection(messageCollection).insertOne(message);
      client.close();
    })
  },

  put(message) {
    MongoClient.connect(url, (err, client) => {
      if (err) {
        throw err;
      }
      const db = client.db(dbName);
      let success = db.collection(messageCollection).updateOne(
        {_id: message._id},
        { $set:
          {
            "edits": message.edits,
            "filters": message.filters,
            "text": message.text
          }
        },
        function (err, docs) {
          if (err) {
            throw err;
          }
          console.log(success);
        }
      );
      client.close();
    })
  },

  delete(messageId) {
    MongoClient.connect(url, (err, client) => {
      if (err) {
        throw err;
      }
      const db = client.db(dbName);
      db.collection(messageCollection).deleteOne({_id: parseInt(messageId)}, console.log);
      client.close();
    })
  },

  clear() {
    MongoClient.connect(url, (err, client) => {
      if (err) {
        throw err;
      }
      const db = client.db(dbName);
      db.collection(messageCollection).drop();
      client.close();
    });
  }

}

module.exports = store;
