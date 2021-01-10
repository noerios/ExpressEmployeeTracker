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


//ask the user what they would like to don - add department, role, employee
function start() {
    inquirer
      .prompt({
        name: "firstChoice",
        type: "list",
        message: "Would you like to [ADD EMPLOYEE], [ADD DEPARTMENT], [ADD ROLE], OR [END PROGRAM]?",
        choices: ["ADD EMPLOYEE", "ADD DEPARTMENT", "ADD ROLE", "END PROGRAM"]
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

//add role

function addRole() {
  

  inquirer
    .prompt([
      {
        name: "role_title",
        type: "input",
        message: "What is the title of the role?"
      },
      {
        name: "salary",
        type: "number",
        message: "What is the salary?"
      }, 

      connection.query("SELECT * FROM department", function(err, results) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "dept",
              type: "rawlist",
              choices: function() {
                var choiceArray = [];
                for (var i = 0; i <results.length; i++) {
                  choiceArray.push(results[i].id);
                }
                return choiceArray;
              },
              message: "Which department ID would you like to add?"
            }
          ])
      })


    ]).then(function(answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
        title: answer.role_title,
        salary: answer.salary,
        department_id: answer.dept
      })
      

      //start();
    })
}




 //update employee roles - get role id that needs updating, then use that to get one employee to update

//add employees

  //add employee roles - inquirer asks which department it belongs to, retrieve all departments and then list them out
//query the database for department ids
