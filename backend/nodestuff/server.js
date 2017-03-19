'use strict';

const express = require('express');
// async call backs mad simple https://www.npmjs.com/package/async
var async = require('async');
// Require the driver.
var pg = require('pg');

// Constants
const PORT = 8081;


// Connect to the "bank" database.
var config = {
  user: 'maxroach',
  host: 'localhost',
  database: 'bank',
  port: 26257
};

// Connect to  pg
pg.connect(config, function (err, client, done) {
  // Closes communication with the database and exits.
  var finish = function () {
    done();
    process.exit();
  };

  if (err) {
    console.error('could not connect to cockroachdb', err);
    finish();
  }
  async.waterfall([
    function (next) {
      // Create the "accounts" table.
      client.query("CREATE TABLE IF NOT EXISTS ingredients (id INT PRIMARY KEY, item STRING);", next);
    },

  ],
  function (err, results) {
    if (err) {
      console.error('error crating table', err);
      finish();
    }

    finish();
  });
});



// App
const app = express();
app.put('/pushnewdata', function (err, req, res) {
    //TODO get the data form the body and pass into insertIngredientToDb

    // If there is no error while trying to input
    if(!err){
        insertIngredientToDb(data,insertSuccessful=>{
            if(insertSuccessful){
                console.log("push new data endpoint called");
                res.status(200).send('You successfully put in new data\n');
            }else{
                console.log("Something went wrong when calling insertIngredientToDb");
                res.status(200).send('insert data failed \n');
            }
        });
    }
    // If there's an error uploading the file
    else{
        res.status(500).send('Something went wrong while trying to insert new data');
    }
  
});
function insertIngredientToDb(data,myCallback){
    

   
}
function getIngredientFromDb(id,dataCallBack){
    //TODO get the items and return in a dataCallBack

}

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);