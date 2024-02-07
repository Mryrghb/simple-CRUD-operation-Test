const express = require("express");
const bodyParser = require("body-parser");
const todoListRoutes = express.Router();
const fs = require('fs');


const dataPath = './Details/todo.json' 

// write in json
const savetodoUsers = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}

//read of json 
const gettodoList = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)    
}

// find one todo by taskName - for Read
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



// create strat url 
todoListRoutes.get('/todo', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }

      res.send(JSON.parse(data));
    });
  });


//create new Todo ------------------------------------------------------------------------ C
  todoListRoutes.post('/todo/addTask', (req, res) => {
   
    const existTask = gettodoList()
    const newTaskId = Math.floor(100000 + Math.random() * 900000)
    existTask.push({taskId: newTaskId, ...req.body})
    console.log({existTask, body: req.body});

    saveAccountData(existTask);
    return res.send({success: true, msg: 'todo data added successfully'})
})


// Read all todo -------------------------------------------------------------------------- R
todoListRoutes.get('/todo/list', (req, res) => {
  const tasks = gettodoList()
  res.send(tasks)
})

//read One todo 
todoListRoutes.get('/todo/taskName/:taskName', (req, res) => {
  console.log({params: req.params})
  const foundedTask = getOneOfTodo({taskName: req.params["taskName"]})
  res.send(foundedTask)
})


// Update todo -------------------------------------------------------------------------------- U
todoListRoutes.put('/todo/:taskName', (req, res) => {

  const existTodoList = gettodoList();
  const TodoData = req.body;
  if(TodoData.taskName === null || TodoData.taskDetail === null || TodoData.done === null ) {
      return res.status(401).send({error: true, msg: 'todoList Data missing'});
  }

  existTodoList.find(todo => {
      if(todo.taskName === TodoData.taskName) {
        todo.done = TodoData.done;
      }
  })

  console.log(JSON.stringify(existTodoList));


  savetodoUsers(existTodoList);
  res.send({success: true, msg: 'todoList data updated successfully'});
});







//delete todo ---------------------------------------------------------------------------------- D
todoListRoutes.delete('/todo/:taskName', bodyParser.json(),(req, res) => {

    const existTodoList = gettodoList();
    const todoListData = req.params;
    const newListOfTodo = existTodoList.filter(todo => todo.taskName !== todoListData.taskName)
    savetodoUsers(newListOfTodo);
    res.send({success: true, msg: 'this todo data deleted successfully'});
  })


module.exports = todoListRoutes
