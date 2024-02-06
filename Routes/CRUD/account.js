const express = require("express");
const bodyParser = require("body-parser");
const accountRoutes = express.Router();
const fs = require('fs');


const dataPath = './Details/useraccount.json' 


const saveAccountData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}

const getAccounts = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)    
}

const getOneAcount = ({
  userName,
  id,
  email
}) => {
  const existAccounts = getAccounts();
  let foundedAcount = null;
  if (userName) {
    const foundedByUserName = existAccounts.find((ac) => ac.userName === userName);
    if (foundedByUserName) foundedAcount = foundedByUserName
    console.log({foundedByUserName})
  }
  return foundedAcount
}
//test for use in delete oparation
const getOneAcountById = ({
  userName,
  id,
  email
}) => {
  const existAccounts = getAccounts();
  let foundedAcount = null;
  if (id) {
    const foundedById = existAccounts.find((ac) => ac.id === id);
    if (foundedById) foundedAcount = foundedById
    console.log({foundedById})
  }
  return foundedAcount
}



// read json data
accountRoutes.get('/account', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      res.send(JSON.parse(data));
    });
  });


  accountRoutes.post('/account/addaccount', (req, res) => {
   
    const existAccounts = getAccounts()
    const newAccountId = Math.floor(100000 + Math.random() * 900000)
    existAccounts.push({id: newAccountId, ...req.body})
    console.log({existAccounts, body: req.body});

    saveAccountData(existAccounts);
    return res.send({success: true, msg: 'account data added successfully'})
})


// Read - get all accounts from the json file
accountRoutes.get('/account/list', (req, res) => {
  const accounts = getAccounts()
  res.send(accounts)
})

accountRoutes.get('/account/name/:name', (req, res) => {
  console.log({params: req.params})
  const foundedAcount = getOneAcount({userName: req.params["name"]})
  res.send(foundedAcount)
})


//do not update!!!!
// Update - using Put method
accountRoutes.put('/account/:name', (req, res) => {

  fs.readFile(dataPath, "utf8" , (err,data)=>{
    if (err){
      console.log("error in reading accounts information!")
    } else{
      const existAcc = getAccounts()
      const foundAcc = req.params['id'];
      existAcc[foundAcc] = req.body;
      saveAccountData(existAcc);
      res.send("update details")

      // const existUserss = getAccounts()
      // getAccounts.put({...req.body})
      // saveAccountData(getAccounts)
      // res.send("succes!")
   
    }
  })
});






//do not delete!!!
//delete - using delete method
accountRoutes.delete('/account/delete/:id', bodyParser.json(),(req, res) => {
  fs.readFile(dataPath, "utf8", (err, data)=>{
    var exsitAccount = getAccounts()
    const user = req.params['id'];
    delete exsitAccount[user];
    saveAccountData(exsitAccount);
    res.send(`ok`)}, true);
  })


  //S1
  // fs.readFile(dataPath, "utf8", (err, data)=>{
  // let exsit = getAccounts();
  // let doneDel = getOneAcountById({id: req.params['id']})
  //  remo(exsit[doneDel])
  // saveAccountData(exsit)
  // res.send({exsit})
  // })
  // delete foundedAcount[{foundedById}]
  // saveAccountData(existAccounts)
  // console.log({foundedById})

  //S2
  // const exitAcc = getAccounts()
  // fs.readFile(dataPath, "utf8", (err, data)=>{
  //   let exitAcc = getAccounts()
  //   const found = req.params['id'];
  //   delete exitAcc[found]
  //   saveAccountData(getAccounts);
  //   res.send("succes")
  // })

  //S3
  // const foundedAcount = getOneAcount()
  // const acc = getAccounts.find(ac => ac.id === req.params.id);
  // acc = ({...req.body});
  //  fs.readFile(dataPath, 'utf8', (err, data) => {
  //   var existAccounts = getAccounts()

  //   const userId = req.params['id'];

  //   delete existAccounts[userId];  
  //   saveAccountData(existAccounts);
  //   res.send(`accounts with id ${userId} has been deleted`)
  // }, true);

module.exports = accountRoutes