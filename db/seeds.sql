INSERT INTO department (department_name)
VALUES('Sales');

INSERT INTO role (title, salary, department_id)
VALUES('Sales Lead', 10000.00, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES('John', 'Wright', 1, NULL);
