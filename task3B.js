import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
//import mongoose from "mongoose";
//import Promise from "bluebird";

//require("./Models/users.js");
//require("./Models/pets.js");

const app = express();
app.use(cors());

const notFound = "Not Found";
let petsArr = {};

function getPets(petsUrl = "https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json"){
  fetch(petsUrl)
	  .then(async (res) => {
	  petsArr = await res.json();
  })
	  .catch(err => {
	  console.log('Error load json data:', err);
  });
  return petsArr;
}

petsArr = getPets();

//mongoose.Promise = Promise;
//mongoose.connect('mongodb://publicdb.mgbeta.ru/irekKarimov');

//let pet1 = new Users({"id": 1, "username":  "user1"});
  //if(usersArr){
    //userArr.forEach(function(item){
      // console.log(item.username);
    //});
  //}


//import UsersModel from "./Models/users.js";
//let UsersModel = require('./Models/users').UsersModel;

app.get("/", (req, res) => {
	res.json(petsArr);
});

app.get("/init", (req, res) => {
  let user;
  //let user1 = new Users({"id": 2, "username":  "user2"});
  petsArr.users.forEach( function(item, index, petsArr){
    console.log(index + " ==== " + item.username);
    user = new UsersModel({
      id: item.id,
      username: item.username,
      fullname: item.fullname,
      password: item.password,
      values: item.values
    });
    user.save();
  });
	res.json(petsArr.users[0]);
});


app.get("/pets/:id", (req, res) => {
  let result = petsArr.pets.filter(function(item){
    return (item.id == req.params.id);
  });
  result = result[0];
  if(!result){
    res.statusCode = 404;
    res.send(notFound);
  }
  res.json(result);
});

app.get("/users/:id", (req, res) => {
  let result = petsArr.users.filter(function(item){
    if(isNaN(req.params.id)){
      return (item.username == req.params.id);
    }else{
      return (item.id == req.params.id);
   }
  });
  result = result[0];
  if(!result){
    res.statusCode = 404;
    res.send(notFound);
  }
  res.json(result);
});

// ===========================
app.get("*", (req, res) => {
  let parm = req.params;
  let result = petsArr;
  let Pets = petsArr.pets;
  let Users = petsArr.users;

  if((parm[0] == "/") && (!req.query[0])){    
    result = petsArr;
  }

  if((parm[0] == "/pets") && (!req.query[0])){
    result = petsArr.pets;
  }

  if((parm[0] == "/pets") && (req.query.type)){
    result = Pets.filter(function(item){
      if(req.query.age_gt && req.query.age_lt){
        return ((item.type === req.query.type) && (item.age > req.query.age_gt) && (item.age < req.query.age_lt));
      }else if(req.query.age_gt){
        return (((item.type === req.query.type) && (item.age > req.query.age_gt)));
      }else if(req.query.age_lt){
        return ((item.type === req.query.type) && (item.age < req.query.age_lt));
      }else{
        return (item.type === req.query.type);
      }
    });
  }else{
  if((parm[0] == "/pets") && (req.query.age_gt)){
    result = Pets.filter(function(item){
      return (item.age > req.query.age_gt);
    });
  }

  if((parm[0] == "/pets") && (req.query.age_lt)){
    result = Pets.filter(function(item){
      return (item.age < req.query.age_lt);
    });
  }
  }

// Users
if((parm[0] == "/users") && (req.query.havePet)){
  result = Users.filter(function(item){
    let userId = item.id;
    return(Pets.find(function(pitem){
      return((pitem.type == req.query.havePet) && (pitem.userId == userId));
    }));
  });
}else if((parm[0] == "/users") && (!req.query[0])){
  result = Users;
}

  if(!result){
    res.statusCode = 404;
    res.send(notFound);
  }else{
    res.json(result);
  }

});






app.listen(3000, () => {
  console.log('================= Task3B listening on port 3000!');
});
