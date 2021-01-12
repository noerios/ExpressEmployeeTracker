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
};

function addRole() {
//add employee roles - inquirer asks which department it belongs to, retrieve all departments and then list them out
//query the database for department ids
connection.query("SELECT * FROM department", function(err, results) {
  if(err) throw err;

inquirer
  .prompt ([
    {
      name: "deptId",
      type: "rawlist",
      choices: function() {
        var idArray = [];
        for (var i = 0; i < results.length; i++) {
          idArray.push(results[i].id);
        } 
        return idArray;
      },
      message: "Which department does this role fall within?"
    },
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
  ])
  .then(function(answer) {
    connection.query(
      "INSERT INTO role SET ?",
      {
        title: answer.role_title,
        salary: answer.salary,
        department_id: answer.deptId 
      }
    )
    start();
  });
});
};

//add employees

function addEmployee() {
  connection.query("SELECT * FROM role", function(err, results) {
    if (err) throw err;

    inquirer
    .prompt ([
      {
        name: "roleId",
        type: "rawlist",
        choices: function() {
          var idArray = [];
          for (var i = 0; i < results.length; i++) {
            idArray.push(results[i].id);
          } 
          return idArray;
        },
        message: "Which role ID is associated with this employee?"
      },
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?"
      },
    ])
    
  connection.query("SELECT * FROM employee", function(err, results) {
    if (err) throw err;

    inquirer
    .prompt ([
      {
        name: "mgrId",
        type: "rawlist",
        choices: function() {
          var idArray = [];
          for (var i = 0; i < results.length; i++) {
            idArray.push(results[i].id);
          } 
          return idArray;
        },
        message: "Which manager ID is does this employee report to?"
      },
    ]).then(function(answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.roleId,
          manager_id: answer.mgrId 
        }
      )
      start();
    });
  })
  })


}

 //update employee roles - get role id that needs updating, then use that to get one employee to update



  
