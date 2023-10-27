// require inquirer package
const inquirer = require('inquirer');
const mysql = require('mysql2');


const db = mysql.createConnection(
    {
        host: "localhost",
        // MySQL username,

        user: "root",
        // TODO: Add MySQL password here
        password: "21WorkingCode*",
        database: "company_db",
        port: 3306
    },
    console.log(`Connected to the company_db database.`)
);

// array of a question for user input
const questions = [
    {
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
    }
];

function mainMenu() {
inquirer.prompt(questions).then(response => {
    // show questions based on user selection

   if(response.options === 'View All Employees') {
    viewAllEmployees();
   } else if (response.options === 'Add Employee'){
    addEmployee();
   } else if (response.options === 'View All Roles') {
    viewAllRoles();
   }
    
})
}

mainMenu();

function viewAllEmployees() {
    db.query('SELECT * FROM employee;', function(err, res) {
        if(err) {
            console.log(err);
        } else {
            console.table(res);
            mainMenu();
        }
    })
}

function addEmployee() {inquirer.prompt( [
    {
        type: 'input',
        name: 'employeeName',
        message: 'What employee do you want to add?',

    }
]).then(response =>{
    console.log(response)
    mainMenu();
})
}


function viewAllRoles() {
    db.query('SELECT * FROM role', function(err, res) {
        if(err) {
            console.log(err);
        } else {
            console.table(res);
            mainMenu();
        }
    })
}



// function updateEmployeeRole() {

// }

// create functions that handle when a user chooses one option, they are prompted with the next option
// call those functions starting on line 15


