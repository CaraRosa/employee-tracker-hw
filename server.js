// require inquirer package
const inquirer = require('inquirer');
const mysql = require('mysql2');


const db = mysql.createConnection(
    {
        host: "127.0.0.1",
        user: "root",
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
   } else if(response.options === 'Update Employee Role') {
    updateEmployeePromise()
   } else if(response.options === 'Add Department') {
    addDepartment();
   } else if (response.options === 'Add Role') {
    addRole();
   }
    
})
}

mainMenu();



function viewAllEmployees() {
    db.query(
        "SELECT e.first_name, e.last_name, r.title AS role, d.department_name AS department, r.salary, CONCAT(m.first_name, '', m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;",

        function(err, res) {
            if(err) {
                console.log(err);
            } else {
                console.table(res);
                mainMenu();
            }
        }
    );
}


async function updateEmployeePromise() {
    const employeeData = await db.promise().query('SELECT * FROM employee;');
    console.log("Employee's data", employeeData[0]);
    const employees = employeeData[0].map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
    })); 


    inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee role do you want to update?",
            choices: employees
        }
    ]).then(employeeToUpdate => {
        console.log(employeeToUpdate);
        const selectedEmployeeId = employeeToUpdate.employeeId;

        inquirer.prompt([
            {
                type: 'list',
                name: 'newRoleId',
                message: 'Which role do you want to assign the selected employee?',
                choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead']
            }
        ]).then(async newRoleSelection => {
            console.log(newRoleSelection);
            const newRoleId = await getRoleIdByName(newRoleSelection.newRoleId);
            db.query(
                'UPDATE employee SET role_id = ? WHERE id = ?',
                [newRoleId, selectedEmployeeId],
                function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Employee role updated successfully!");
                        mainMenu();
                    }
                }
            );
        });
    });
}

// Function to get role ID by role name
async function getRoleIdByName(roleName) {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT id FROM role WHERE title = ?',
            [roleName],
            function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    if (results.length === 0) {
                        reject(new Error(`Role '${roleName}' not found.`));
                    } else {
                        resolve(results[0].id);
                    }
                }
            }
        );
    });
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


function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?'
        },
    ]).then(response => {
        const departmentName = response.departmentName;

        db.query('INSERT INTO department (department_name) VALUES (?)',
        [departmentName],
        function (err, res) {
            if(err) {
                console.log(err);
            } else {
                console.log('Department added successfully!');
                mainMenu();
            }
            }
        );
    });
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'input',
            name: 'roleDepartment',
            message: 'Which department does the role belong to?'
        }
    ]).then(response => {
        const title = response.roleTitle;
        const salary = response.roleSalary;
        const departmentId = response.departmentId;

        db.query(
            'INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)', [title, salary, departmentId],

            function(err, res) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('Role add successfully!');
                    mainMenu();
                }
            }
        );
    });
}