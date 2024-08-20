import inquirer from "inquirer";
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import ctable from 'console.table';



function startup(): void{
    art();
    
  inquirer.prompt({
    type: 'list',
    name: 'startup',
    message: 'What would you like to do?',
    choices: ['View all employees', 'Add employee', 'Add role', 'Add department', 'Update employee role', 'View all roles', 'View all departments', 'Exit']
  })
  .then(function(answers){
    if (answers.startup === 'Add employee'){
        console.log('Add employee selected');
        // addEmployee();
    } 
    else if (answers.startup === 'Add role'){
        console.log('Add role selected');
        // addRole();
    } 
    else if (answers.startup === 'Add department'){
        console.log('Add department selected');
        // addDepartment();
    }
    else if (answers.startup === 'Update employee role'){
        console.log('Update employee role selected');
    //   updateEmployeeRole();
    } 
    else if (answers.startup === 'View all employees'){
        console.log('View all employees selected');
    //   viewAllEmployees();
    }
    else if (answers.startup === 'View all roles'){
        console.log('View all roles selected');
    //   viewAllRoles();
    }
    else if (answers.startup === 'View all departments'){
        console.log('View all departments selected');
    //   viewAllDepartments();
    }
    else if (answers.startup === 'Exit'){
        console.log('Exit selected');
    //   exit();
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
            const sql = 'INSERT INTO employee (first_name, last_name, manager_id) VALUES ($1, $2, $3)';
            const params = [answers.firstName, answers.lastName, answers.manager];
            //result??
            pool.query(sql, params, (err: Error, result: QueryResult) => {
                if (err) {
                    console.log(err);
                } 
                else if (result) {
                console.table(result.rows); //=?
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
                } else {
                console.log(`${answers.newRole}added`);
                console.table(result.rows);
                startup();
                }
            })
        })
}

function addDepartment(): void{
    inquirer.prompt({
        type: 'input',
        name: 'newDepartment',
        message: 'What is the name of the department you would like to add?'
    })
    .then((answers) => {
        console.log(`addDepartment selected`);
        const sql = 'INSERT INTO department (name) VALUES ($1)';
        const params = [answers.newDepartment];

        pool.query(sql, params, (err: Error, result: QueryResult) => {
            if (err){
                console.log(err);
            } else {
            console.log(`${answers.newDepartment} added`);
            console.table(result.rows);
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
            } else {
            console.log(`${answers.employeeId} updated`);
            console.table(result.rows);
            startup();
            }
        })
    })
}

function viewEmployees(): void {
    console.log('viewEmployees selected');
    const sql = 'SELECT * FROM employee';
    
    pool.query(sql, (err, res) => {
        if (err) {
            console.log(err);
        } else {
        console.table(res.rows);
        startup();
        }
    })
}

function viewRoles(): void {
    console.log('viewRoles selected');
    const sql = 'SELECT * FROM role';

    pool.query(sql, (err: Error, result: QueryResult) => {
        if (err) {
            console.log(err);
        } else {
        console.table(result.rows);
        startup();
        }
    })
}

function viewDepartments(): void {
    console.log('viewDepartments selected');
    const sql = 'SELECT * FROM department';
    pool.query(sql, (err: Error, result: QueryResult) => {
        if (err) {
            console.log(err);
        } else {
        console.table(result.rows);
        startup();
        }
    })
}

function exit(): void {
    console.log('Thanks for using the employee tracker!');
    pool.end();
}

function art(): void {
    console.log('      ___           ___           ___           ___       ___           ___           ___           ___              ');
    console.log('     /\  \         /\__\         /\  \         /\__\     /\  \         |\__\         /\  \         /\  \             ');
    console.log('    /::\  \       /::|  |       /::\  \       /:/  /    /::\  \        |:|  |       /::\  \       /::\  \            ');
    console.log('   /:/\:\  \     /:|:|  |      /:/\:\  \     /:/  /    /:/\:\  \       |:|  |      /:/\:\  \     /:/\:\  \           ');
    console.log('  /::\~\:\  \   /:/|:|__|__   /::\~\:\  \   /:/  /    /:/  \:\  \      |:|__|__   /::\~\:\  \   /::\~\:\  \          ');
    console.log(' /:/\:\ \:\__\ /:/ |::::\__\ /:/\:\ \:\__\ /:/__/    /:/__/ \:\__\     /::::\__\ /:/\:\ \:\__\ /:/\:\ \:\__\         ');
    console.log(' \:\~\:\ \/__/ \/__/~~/:/  / \/__\:\/:/  / \:\  \    \:\  \ /:/  /    /:/~~/~    \:\~\:\ \/__/ \:\~\:\ \/__/        ');
    console.log('  \:\ \:\__\         /:/  /       \::/  /   \:\  \    \:\  /:/  /    /:/  /       \:\ \:\__\    \:\ \:\__\           ');
    console.log('   \:\ \/__/        /:/  /         \/__/     \:\  \    \:\/:/  /     \/__/         \:\ \/__/     \:\ \/__/           ');
    console.log('    \:\__\         /:/  /                     \:\__\    \::/  /                     \:\__\        \:\__\             ');
    console.log('     \/__/         \/__/                       \/__/     \/__/                       \/__/         \/__/             ');
    console.log('     ___           ___           ___           ___           ___           ___           ___                        ');
    console.log('    /\__\         /\  \         /\__\         /\  \         /\  \         /\  \         /\  \                       ');
    console.log('   /::|  |       /::\  \       /::|  |       /::\  \       /::\  \       /::\  \       /::\  \                      ');
    console.log('  /:|:|  |      /:/\:\  \     /:|:|  |      /:/\:\  \     /:/\:\  \     /:/\:\  \     /:/\:\  \                     ');
    console.log(' /:/|:|__|__   /::\~\:\  \   /:/|:|  |__   /::\~\:\  \   /:/  \:\  \   /::\~\:\  \   /::\~\:\  \                    ');
    console.log('/:/ |::::\__\ /:/\:\ \:\__\ /:/ |:| /\__\ /:/\:\ \:\__\ /:/__/_\:\__\ /:/\:\ \:\__\ /:/\:\ \:\__\                   ');
    console.log('\/__/~~/:/  / \/__\:\/:/  / \/__|:|/:/  / \/__\:\/:/  / \:\  /\ \/__/ \:\~\:\ \/__/ \/_|::\/:/  /                   ');
    console.log('      /:/  /       \::/  /      |:/:/  /       \::/  /   \:\ \:\__\    \:\ \:\__\      |:|::/  /                    ');
    console.log('     /:/  /        /:/  /       |::/  /        /:/  /     \:\/:/  /     \:\ \/__/      |:|\/__/                     ');
    console.log('    /:/  /        /:/  /        /:/  /        /:/  /       \::/  /       \:\__\        |:|  |                       ');
    console.log('    \/__/         \/__/         \/__/         \/__/         \/__/         \/__/         \|__|                       ');
    
}

