const express = require("express");
const bodyParser = require("body-parser");
const todoListRoutes = express.Router();
const fs = require('fs');


const dataPath = './Details/todo.json' 


const savetodoUsers = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}

const gettodoList = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)    
}

const getOneOfTodo = ({
    userId,
    taskId,
    taskName,
    taskDetail,
    done
}) => {
  const existTask = gettodoList();
  let foundedTask = null;
  if (taskName) {
    const foundedByTaskName = existTask.find((ac) => ac.taskName === taskName);
    if (foundedByTaskName) foundedTask = foundedByTaskName
    console.log({foundedByTaskName})
  }
  return foundedTask
}



// read json data
todoListRoutes.get('/todo', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      res.send(JSON.parse(data));
    });
  });


  todoListRoutes.post('/todo/addTask', (req, res) => {
   
    const existTask = gettodoList()
    const newTaskId = Math.floor(100000 + Math.random() * 900000)
    existTask.push({taskId: newTaskId, ...req.body})
    console.log({existTask, body: req.body});

    saveAccountData(existTask);
    return res.send({success: true, msg: 'account data added successfully'})
})


// Read - get all accounts from the json file
todoListRoutes.get('/todo/list', (req, res) => {
  const tasks = gettodoList()
  res.send(tasks)
})

todoListRoutes.get('/todo/taskName/:taskName', (req, res) => {
  console.log({params: req.params})
  const foundedTask = getOneOfTodo({taskName: req.params["taskName"]})
  res.send(foundedTask)
})


//do not update!!!!
// Update - using Put method
todoListRoutes.put('/account/:name', (req, res) => {

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
todoListRoutes.delete('/account/delete/:id', bodyParser.json(),(req, res) => {
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

module.exports = todoListRoutes