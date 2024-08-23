import inquirer from "inquirer";
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
// import cTable from 'console.table';

await connectToDb();

art();

function startup(): void{
    
  inquirer.prompt({
    type: 'list',
    name: 'startup',
    message: 'What would you like to do?',
    choices: ['View all employees', 'Add employee', 'Add role', 'Add department', 'Update employee role', 'View all roles', 'View all departments', 'Exit']
  })
  .then(function(answers){
    if (answers.startup === 'Add employee'){
        console.log('Add employee selected');
        addEmployee();
    } 
    else if (answers.startup === 'Add role'){
        console.log('Add role selected');
        addRole();
    } 
    else if (answers.startup === 'Add department'){
        console.log('Add department selected');
        addDepartment();
    }
    else if (answers.startup === 'Update employee role'){
        console.log('Update employee role selected');
        updateEmployee();
    } 
    else if (answers.startup === 'View all employees'){
        console.log('View all employees selected');
        viewEmployees();
    }
    else if (answers.startup === 'View all roles'){
        console.log('View all roles selected');
        viewRoles();
    }
    else if (answers.startup === 'View all departments'){
        console.log('View all departments selected');
        viewDepartments();
    }
    else if (answers.startup === 'Exit'){
        console.log('Exit selected');
        exit();
    }
  })
};

startup();

function addEmployee(): void{
    inquirer.prompt([
        { 
            type: 'input', 
            name: 'firstName', 
            message: 'What is the employee\'s first name?' 
        }, {
            type: 'input',
            name: 'lastName',
            message: 'What is the employee\'s last name?'
        }, {
            type: 'input',
            name: 'department',
            message: 'What is the employee\'s department?'
        }, {
            type: 'input',
            name: 'role',
            message: 'What is the employee\'s role?'
        }, {
            type: 'input',
            name: 'manager',
            message: 'Who is the employee\'s manager?'
        }])
        .then((answers) => {
            console.log(`addEmployee selected`);
            // select statement to get employee
            const sql = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *';
            const params = [answers.firstName, answers.lastName, answers.role_id, answers.manager];
            //result??
            pool.query(sql, params, (err: Error, result: QueryResult) => {
                if (err) {
                    console.log(err);
                    return;
                } 
                else if (result) {
                console.log(result.rows); //=?
                console.log(`${answers.firstName} ${answers.lastName} added`);
                startup();
                }
            })
        })
}

function addRole(): void{
    inquirer.prompt(
        {
            type: 'input',
            name: 'newRole',
            message: 'What is the name of the role you would like to add? Note: Any role can be added to any department.'
        })
        .then((answers) => {
            console.log(`addRole selected`);
            const sql = 'INSERT INTO role (title) VALUES ($1)';
            const params = [answers.newRole];

            pool.query(sql, params, (err: Error, result: QueryResult) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                console.log(`${answers.newRole}added`);
                console.log(result.rows);
                startup();
                }
            })
        })
}

async function addDepartment(): Promise<void>{
    //fetch and display current departments before adding
    const fetchDepartments = await pool.query('SELECT * FROM departments');
    console.log(fetchDepartments.rows);
    //change to array of objects
    // key value pairs of name and value
    // map > new key value pairs 

    // pool.query(fetchDepartments, '',(err: Error, result: QueryResult) => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     } else {
    //     const departments = result.rows;
    //     const departmentNames = departments.map((department: { name: string; }) => department.name);
    //     console.log('Here is a list of current departments for reference:');
    //     console.log(departmentNames);
    //     }
    // })

    
    

    inquirer.prompt({
        type: 'input',
        name: 'newDepartment',
        message: 'What is the name of the department you would like to add?'
    })
    .then((answers) => {
        console.log(`addDepartment selected`);
        const sql = 'INSERT INTO department (name) VALUES ($1) RETURNING *';
        const params = [answers.newDepartment];

        pool.query(sql, params, (err: Error, result: QueryResult) => {
            if (err){
                console.log(err);
                return;
            } else {
            console.log(`${answers.newDepartment} added`);
            console.log(result.rows);
            startup();
            }
        })
    })
}

function updateEmployee(): void {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: 'What is the employee\'s ID?'
        },
        {
            type: 'input',
            name: 'newRoleId',
            message: 'What is the new role ID? ' // change to array of rolls
        }
    ])
    .then((answers) => {
        console.log(`updateEmployee selected`);
        const sql = 'UPDATE employee SET role_id = $1 WHERE id = $2';
        const params = [answers.newRoleId, answers.employeeId];
        

        pool.query(sql, params, (err: Error, result: QueryResult) => {
            if (err) {
                console.log(err);
                return;
            } else {
            console.log(`${answers.employeeId} updated`);
            console.log(result.rows);
            startup();
            }
        })
    })
}

function viewEmployees(): void {

    console.log('viewEmployees selected');
    const sql = 'SELECT * FROM employees';
    
    pool.query(sql, (err: Error, result: QueryResult) => {
        if (err) {
            console.log(err);
            return;
        } else {
        console.log(result.rows);
        startup();
        }
    })
}

function viewRoles(): void {
    console.log('viewRoles selected');
    const sql = 'SELECT * FROM roles';

    pool.query(sql, (err: Error, result: QueryResult) => {
        if (err) {
            console.log(err);
            return;
        } else {
        console.log(result.rows);
        startup();
        }
    })
}

//main function to console.log departments
//refactored to return an array of departments for use in other functions
function viewDepartments(): void {
    console.log('viewDepartments selected');
    const sql = 'SELECT * FROM departments';
    pool.query(sql, (err: Error, result: QueryResult) => {
        if (err) {
            console.log(err);
            // return [''];
        } else {
            console.log(result.rows);
            // const departments = result.rows;
            // const departmentNames = departments.map((department: { name: string; }) => department.name);
            // console.log(`viewAllDepartment names: $departmentNames`);
            startup();
            // return departmentNames;
            
        }
    })
}

function exit(): void {
    console.log('Thanks for using the employee tracker!');
    pool.end();
}

function art(): void {
    //needed to use double backslashes "\\" for every single "\" to escape the original functionality
    console.log(' ________  __       __  _______   __        ______  __      __  ________  ________       ');
    console.log('|        \\|  \\     /  \\|       \\ |  \\      /      \\|  \\    /  \\|        \\|        \\      ');
    console.log('| $$$$$$$$| $$\\   /  $$| $$$$$$$\\| $$     |  $$$$$$\\\\$$\\  /  $$| $$$$$$$$| $$$$$$$$      ');
    console.log('| $$__    | $$$\\ /  $$$| $$__/ $$| $$     | $$  | $$ \\$$\\/  $$ | $$__    | $$__          ');
    console.log('| $$  \\   | $$$$\\  $$$$| $$    $$| $$     | $$  | $$  \\$$  $$  | $$  \\   | $$  \\         ');
    console.log('| $$$$$   | $$\\$$ $$ $$| $$$$$$$ | $$     | $$  | $$   \\$$$$   | $$$$$   | $$$$$         ');
    console.log('| $$_____ | $$ \\$$$| $$| $$      | $$_____| $$__/ $$   | $$    | $$_____ | $$_____       ');
    console.log('| $$     \\| $$  \\$ | $$| $$      | $$     \\\\$$    $$   | $$    | $$     \\| $$     \\      ');
    console.log(' \\$$$$$$$$ \\$$      \\$$ \\$$       \\$$$$$$$$ \\$$$$$$     \\$$     \\$$$$$$$$ \\$$$$$$$$      ');
    console.log('\n');
    console.log(' __       __   ______   __    __   ______    ______   ________  _______                  ');
    console.log('|  \\     /  \\ /      \\ |  \\  |  \\ /      \\  /      \\ |        \\|       \\                 ');
    console.log('| $$\\   /  $$|  $$$$$$\\| $$\\ | $$|  $$$$$$\\|  $$$$$$\\| $$$$$$$$| $$$$$$$\\                ');
    console.log('| $$$\\ /  $$$| $$__| $$| $$$\\| $$| $$__| $$| $$ __\\$$| $$__    | $$__| $$                ');
    console.log('| $$$$\\  $$$$| $$    $$| $$$$\\ $$| $$    $$| $$|    \\| $$  \\   | $$    $$                ');
    console.log('| $$\\$$ $$ $$| $$$$$$$$| $$\\$$ $$| $$$$$$$$| $$ \\$$$$| $$$$$   | $$$$$$$\\                ');
    console.log('| $$ \\$$$| $$| $$  | $$| $$ \\$$$$| $$  | $$| $$__| $$| $$_____ | $$  | $$                ');
    console.log('| $$  \\$ | $$| $$  | $$| $$  \\$$$| $$  | $$ \\$$    $$| $$     \\| $$  | $$                ');
    console.log(' \\$$      \\$$ \\$$   \\$$ \\$$   \\$$ \\$$   \\$$  \\$$$$$$  \\$$$$$$$$ \\$$   \\$$                ');
    console.log('\n');
    console.log('\n');
    console.log('\n');
    
}

