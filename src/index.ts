import inquirer from "inquirer";
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

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
        }])
        .then((answers) => {
            console.log(`Employee added: ${answers.firstName} ${answers.lastName}`);
            pool.query('INSERT INTO employee (first_name, last_name) VALUES ($1, $2)', [answers.firstName, answers.lastName], (err, res) => {
                if (err) {
                    console.log(err);
                } 
                else {
                console.log('Employee added');
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
            message: 'What is the name of the role you would like to add?'
        })
        .then((answers) => {
            console.log(`Role added: ${answers.newRole}`);
            pool.query('INSERT INTO role (title) VALUES ($1)', [answers.newRole], (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                console.log('Role added');
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
        console.log(`department added : ${answers.newDepartment}`);
        pool.query('INSERT INTO department (name) VALUES ($1)', [answers.newDepartment], (err, res) => {
            if (err){
                console.log(err);
            } else {
            console.log('Department added');
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
            message: 'What is the new role ID?'
        }
    ])
    .then((answers) => {
        console.log(`Employee updated: ${answers.employeeId} ${answers.newRoleId}`);
        pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.newRoleId, answers.employeeId], (err, res) => {
            if (err) {
                console.log(err);
            } else {
            console.log('Employee updated');
            startup();
            }
        })
    })
}

function viewEmployees(): void {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            console.log(err);
        } else {
        console.log(res.rows);
        startup();
        }
    })
}

function viewRoles(): void {
    pool.query('SELECT * FROM role', (err, res) => {
        if (err) {
            console.log(err);
        } else {
        console.log(res.rows);
        startup();
        }
    })
}

function viewDepartments(): void {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.log(err);
        } else {
        console.log(res.rows);
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

