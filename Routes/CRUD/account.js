const express = require("express");
const bodyParser = require("body-parser");
const accountRoutes = express.Router();
const fs = require('fs');


const dataPath = './Details/useraccount.json' 

//Write data to account.json
const saveAccountData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}

//Read data from account.json
const getAccounts = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)    
}

//found acc for read One of Acc - R
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

// start url CRUD
accountRoutes.get('/account', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      res.send(JSON.parse(data));
    });
  });


// create new account ------------------------------------------------------------------------ C
  accountRoutes.post('/account/addaccount', (req, res) => {
   
    const existAccounts = getAccounts()
    const newAccountId = Math.floor(100000 + Math.random() * 900000)
    existAccounts.push({id: newAccountId, ...req.body})
    console.log({existAccounts, body: req.body});

    saveAccountData(existAccounts);
    return res.send({success: true, msg: 'account data added successfully'})
})


// Read all account ---------------------------------------------------------------------------- R
accountRoutes.get('/account/list', (req, res) => {
  const accounts = getAccounts()
  res.send(accounts)
})

//read one account
accountRoutes.get('/account/:name', (req, res) => {
  console.log({params: req.params})
  const foundedAcount = getOneAcount({userName: req.params["name"]})
  res.send(foundedAcount)
})



// Update data json ----------------------------------------------------------------------------- U
accountRoutes.put('/account/:name', (req, res) => {

  const existAccount = getAccounts();
  const accountData = req.body;

  // Incoming data validation
  if(accountData.userName === null || accountData.email === null || accountData.password === null ) {
      return res.status(401).send({error: true, msg: 'account Data missing'});
  }
  
  // Check whether the request Todo exists in Todos.JSON
  existAccount.find(account => {
      if(account.userName === accountData.userName) {
        account.email = accountData.email;
      }
  })
  console.log(JSON.stringify(existAccount));

  saveAccountData(existAccount);
  res.send({success: true, msg: 'account data updated successfully'});

})


//delete account -------------------------------------------------------------------------------- D
accountRoutes.delete('/account/:userName', bodyParser.json(),(req, res) => {
   
    const existAccounts = getAccounts();
    const accountData = req.params;
    const newListOfAccounts = existAccounts.filter(acc => acc.userName !== accountData.userName)
    saveAccountData(newListOfAccounts);
    res.send({success: true, msg: 'account data deleted successfully'});
  })

module.exports = accountRoutes
