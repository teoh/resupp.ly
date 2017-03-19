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
      client.query("CREATE TABLE IF NOT EXISTS accounts (id INT PRIMARY KEY, balance INT);", next);
    },

    // function (next) {
    //   // Insert two rows into the "accounts" table.
    //   client.query("INSERT INTO accounts (id, balance) VALUES (1, 1000), (2, 250);", next);
    // },
    // function (results, next) {
    //   // Print out the balances.
    //   client.query('SELECT id, balance FROM accounts;', next);
    // },
  ],
  function (err, results) {
    if (err) {
      console.error('error crating table', err);
      finish();
    }

    // console.log('Initial balances:');
    // results.rows.forEach(function (row) {
    //   console.log(row);
    // });

    finish();
  });
});

var client = new pg.Client();



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
  //TODO parse the data object and put into the data base using the sql object

  // connect to our database 
  client.connect(function (err) {
    if (err) throw err;
   
    // execute a query on our database 
    client.query('DELETE FROM ingredients WHERE id = $1::int', ['1'], function (err, result) {
      if (err) throw err;
   
      // just print the result to the console 
      console.log(result.rows[0]); // outputs: { name: 'brianc' } 
   
      // disconnect the client 
      client.end(function (err) {
        if (err) throw err;
      });
    });
  });

    
}
function getIngredientFromDb(id,dataCallBack){
    //TODO get the items and return in a dataCallBack

}

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);