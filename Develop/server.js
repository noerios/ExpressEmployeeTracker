var mysql = require("mysql");
var inquirer = require("inquirer");
const { allowedNodeEnvironmentFlags } = require("process");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employee_tracker_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

//ask the user what they would like to do
//add employees
//update employee roles

function start() {
    inquirer
      .prompt({
        name: "firstChoice",
        type: "list",
        message: "Would you like to [ADD EMPLOYEE], [ADD DEPARTMENT], [ADD ROLE], OR [END PROGRAM]?",
        choices: ["ADD EMPLOYEE", "ADD DEPARTMENT", "ADD ROLE"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.firstChoice === "ADD EMPLOYEE") {
          addEmployee();
        }
        else if(answer.firstChoice === "ADD DEPARTMENT") {
          addDepartment();
        } 
        else if(answer.firstChoice === "ADD ROLE") {
            addRole(); 
        }
        else if(answer.firstChoice === "END PROGRAM") {
            connection.end();
        }
      });
  }
//add dept

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department_name",
        type: "input",
        message: "What is the department you'd like to add?"
      },
    ]).then(function(answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {name: answer.department_name}
      );
      start();
    })
}
  //add employee roles - inquirer asks which department it belongs to, retrieve all departments and then list them out