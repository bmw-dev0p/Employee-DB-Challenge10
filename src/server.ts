import inquirer from "inquirer";
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.ts';

function startup(): void{
  inquirer.prompt({
    type: 'list',
    name: 'startup',
    message: 'What would you like to do?',
    choices: ['View all employees', 'Add employee', 'Add role', 'Add department', 'Update employee role', 'View all roles', 'View all departments', 'Exit']
  })
  .then(function(answers){
    if (answers.startup === 'View all employees'){
        console.log('View all employees selected');
    //   viewAllEmployees();
    } else if (answers.startup === 'Add employee'){
        console.log('Add employee selected');
        addEmployee();
    } else if (answers.startup === 'Add role'){
        console.log('Add role selected');
        addRole();
    } else if (answers.startup === 'Add department'){
        console.log('Add department selected');
        addDepartment();
    }
    else if (answers.startup === 'Update employee role'){
        console.log('Update employee role selected');
    //   updateEmployeeRole();
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
                if (err) throw err;
                console.log('Employee added');
                startup();
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
                if (err) throw err;
                console.log('Role added');
                startup();
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
            if (err) throw err;
            console.log('Department added');
            startup();
        })
    })
}

