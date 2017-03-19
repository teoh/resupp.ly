'use strict';

const express = require('express');
// async call backs mad simple https://www.npmjs.com/package/async
var async = require('async');
// Require the driver.
var pg = require('pg');
var bodyParser = require('body-parser');
// App
const app = express();

// Constants
const PORT = 8081;


// Connect to the "bank" database.
var config = {
  user: 'maxroach',
  host: '52.228.33.184',
  database: 'groceries',
  port: 26257
};
// Get ref to the express router
app.use(bodyParser.json());
var router = express.Router();
router.use(function(req, res, next) {
    // Set the default headers configs
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Content-Type","application/json");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


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
      client.query("CREATE TABLE IF NOT EXISTS ingredients (id INT, item STRING);", next);
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




router.post('/pushnewdata', function (req, res) {
    //TODO get the data form the body and pass into insertIngredientToDb

    // If there is no error while trying to input
    console.log(req.body);
    insertIngredientToDb(req.body,(callback)=>{
        if(callback){
            console.log("push new data endpoint called");
            res.status(200).send('You successfully put in new data\n');
        }else{
            console.log("Something went wrong when calling insertIngredientToDb");
            res.status(200).send('insert data failed \n');
        }
    });
  
});

router.get('/getRecomendation', function (req, res) {
    //TODO get the data form the body and pass into insertIngredientToDb

    // If there is no error while trying to input
    pg.connect(config,function (err,client,done) {

        var finish = function () {
            done();
            process.exit();
        };

        client.query('SELECT * FROM groceries.ingredients', (err, result) => {
            if (err) {
                return res.status(200).send('insert data failed \n');
            }
            console.log('rows:');
            console.log(result.rows);

            // disconnect the client
            client.end(function (err) {
                if (err) {
                    throw err;
                }
            });

            res.status(200).send(getRecommendations(result.rows.map(it => {return it.item})));

        });
    })

});


router.get('/getFridge', function (req, res) {
    //TODO get the data form the body and pass into insertIngredientToDb

    // If there is no error while trying to input
    pg.connect(config,function (err,client,done) {

        var finish = function () {
            done();
            process.exit();
        };

        client.query('SELECT * FROM groceries.ingredients', (err, result) => {
            if (err) {
                return res.status(200).send('insert data failed \n');
            }
            console.log('rows:');
            console.log(result.rows);

            // disconnect the client
            client.end(function (err) {
                if (err) {
                    throw err;
                }
            });

            res.status(200).send(result.rows.map(it => {return it.item}));

        });
    })

});

function insertIngredientToDb(data,callback){
  //TODO parse the data object and put into the data base using the sql object

  // Clear out the stuff from the db with that user's info
  // connect to our database 
  pg.connect(config,function (err,client,done) {

    var finish = function () {
      done();
      process.exit();
    };

    if (err) throw err;
   
    // execute a query on our database 
    client.query('DELETE FROM groceries.ingredients WHERE id = 1', function (err, result) {
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
  pg.connect(config,function (err,client,done) {

    var finish = function () {
      done();
      process.exit();
    };

    if (err) throw err;

    let items = data.ingredients;
    // execute a query on our database 

    async.waterfall([

      function (next) {
        // Create the "accounts" table.
        items.forEach(function(item){
          console.log(item)
          client.query("INSERT INTO ingredients (id,item) VALUES ($1,$2);",[1,item],function (err,result){
            done();
            if(err){
              throw err;
            }
          });

          
        });
        callback(true);
        
      }

      
      ],
      function (err,result){
        console.log(err);
        console.log(result);
        finish();
      }

    )
    
  });
}
function getIngredientFromDb(id,callback){
    //TODO get the items and return in a dataCallBack
    //input nothing, you can remove the id if you want
    //output {"fridgeitem1","fridgeitem2","fridgeitem3",....}

}

function ingredientsToFixedVector(ingredients) {
    let fixedVector = [0, 0, 0, 0, 0];
    for (let ingredient of ingredients) {
        switch (ingredient) {
            case "potato":
                fixedVector[0] = 1;
                break;
            case "carrot":
                fixedVector[1] = 1;
                break;
            case "egg":
                fixedVector[2] = 1;
                break;
            case  "mushroom":
                fixedVector[3] = 1;
                break;
            case  "pasta_sause":
                fixedVector[4] = 1;
                break;
        }
    }
    return fixedVector;
}

const recipes = [{
    name: "potato carrot soup",
    ingredients: ["potato", "carrot"]
}, {
    name: "potato mushroom soup",
    ingredients: ["potato", "mushroom"]
}, {
    name: "carrot mushroom soup",
    ingredients: ["carrot", "mushroom"]
}
].map(it => {
    it.vector = ingredientsToFixedVector(it.ingredients);
    return it
});


function distanceSort(a, b) {
    if (a.distance < b.distance) {
        return -1;
    }
    if (a.distance > b.distance) {
        return 1;
    }
    // a must be equal to b
    return 0;
}


function euclideanDistance(a, b) {
    let squaredD =0 ;
    for (let i = 0; i < a.length; i++) {
        squaredD += Math.pow(a[i] - b[i], 2);
    }
  return Math.sqrt(squaredD)
}

function findKTopRecipes(ingredients, k) {
    let vector = ingredientsToFixedVector(ingredients);
    let kTopRecipes = recipes.map(it => {
        it.distance = euclideanDistance(it.vector, vector);
        return it
    }).sort(distanceSort).slice(0, Math.min(k, recipes.length));
    return kTopRecipes
}

function getRecommendations(ingredients) {
    return findKTopRecipes(ingredients, 10)
}

function getRecommendedIngredients(ingredients) {
    let set = new Set();
    for (let recipe of findKTopRecipes(ingredients, 20)){
        for (let ingredient of recipe.ingredients){
            set.add(ingredient);
        }
    }

    return Array.from(set).filter(it => {return !ingredients.includes(it)})
}


app.use('/', router);
app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
