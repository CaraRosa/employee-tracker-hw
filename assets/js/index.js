// require inquirer package
const inquirer = require('inquirer');
const mysql = require('mysql2');


const db = mysql.createConnection(
    {
        host: "127.0.0.1",
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
   } else if (response.options === 'View All Departments') {
    viewAllDepartments();
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
        name: 'employeeFirstName',
        message: 'What is the employee`s first name?'

    },
    {
        type: 'input',
        name: 'employeeLastName',
        message: 'What is the employee`s last name?'
    },
    {
        type: 'list',
        name: 'roles',
        message: 'What is the employee`s role?',
        choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead']
    },
    {
        type: 'list',
        name: 'managers',
        message: 'Who is the employee`s manager?',
        choices: ['John Doe', 'Mike Chan', 'Ashley Rodgriguez', 'Kevin Tupek', 'Kunal Singh', 'Malia Brown']
    }
]).then(response =>{
    const firstName = response.employeeFirstName;
    const lastName = response.employeeLastName;
    const roleId = response.roleId;
    const managerId = response.managerId;

    db.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)', [firstName, lastName, roleId, managerId],
        function (err, res) {
            if(err) {
                console.log(err);
            } else {
                console.log('Employee added successfully!');
                mainMenu();
            }
        }
    );

});

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

function viewAllDepartments() {
    db.query('SELECT * FROM department', function(err, res) {
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


