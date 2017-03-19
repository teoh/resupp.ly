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
  host: '52.228.33.184',
  database: 'groceries',
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
      console.log("creating table");
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

  });
});



// App
const app = express();
app.get('/pushnewdata', function (req, res) {
    //TODO get the data form the body and pass into insertIngredientToDb

    // If there is no error while trying to input
  
    insertIngredientToDb(data,(callback)=>{
        if(callback){
            console.log("push new data endpoint called");
            res.status(200).send('You successfully put in new data\n');
        }else{
            console.log("Something went wrong when calling insertIngredientToDb");
            res.status(200).send('insert data failed \n');
        }
    });
  
});


function insertIngredientToDb(data,callback){
  //TODO parse the data object and put into the data base using the sql object

  // Clear out the stuff from the db with that user's info
  // connect to our database 
  pg.connect(config,function (err,client) {
    if (err) throw err;
   
    // execute a query on our database 
    client.query('DELETE FROM ingredients WHERE id = $1::int', ['1'], function (err, result) {
       if (err) {
            throw err;
            callback(false);
        }
   
      // just print the result to the console 
      console.log(result.rows[0]); 
   
      // disconnect the client 
      client.end(function (err) {
        if (err) {
            throw err;
            callback(false);
        }
        
      });
    });

  });

  // Insert the list of items into the table
  // connect to our database 
  pg.connect(config,function (err,client) {
    if (err) throw err;
   
    var items = ['a','b','c'];
    items.forEach( function(item){
      // execute a query on our database 
      client.query('INSERT INTO ingredients (id,item) VALUES ($1,$2);',[1,item], function (err, result) {
        if (err) throw err;
     
        // just print the result to the console 
        console.log(result.rows[0]); 
     
        // disconnect the client 
        client.end(function (err) {
          if (err) throw err;
        });
      });
    });
    
  });
}
function getIngredientFromDb(id,callback){
    //TODO get the items and return in a dataCallBack

}

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);