# Task-RestAPI
A Representational State Transfer Application Package Interface for Task manager.

## Live link
https://codeblack-task-manager.herokuapp.com
Use Postman to access the Api routes


## Installing
`npm i `  to install all the dependencies, 
`npm run dev` to run the application on server, 
`npm run test` to run the tests on the application.

## Overview
The task manager api sends a Welcome and Farewell message whenever user creates or delete his/her profile. 
Passwords are stored in hased form using bcrypt encryption with 10 salt rounds. Token based authentication is
implemented using Json Web Token, and every route except sign-up and sign-in required authentication to perform.
Jest framework is used for testing. Deleting user profile results in deletion of his/her tasks.
 

## Features
  - Create new user : {{url}}/user - POST
  - Login user  : {{url}}/users/login - POST
  - Logout user : {{url}}/users/logout - POST
  - Logout All users : {{url}}/users/logoutAll - POST
  - Create tasks: {{url}}/tasks - POST
  - Upload a profile pic: {{url}}/users/me/avatar - POST
  - Get Profile details : {{url}}/users/me - GET
  - Get tasks of a particular user: {{url}}/tasks - GET (can add query strings, example - {{url}}/tasks?sortBy=createdAt:asc)
  - Update profile details: {{url}}/users/me - PATCH
  - Update task description: {{url}}/tasks/'task_id' - PATCH
  - Delete Profile: {{url}}/users/me - DELETE
  - Delete Tasks: {{url}}/tasks/'task_id' - DELETE
  - Delete profile pic : {{url}}/users/me/avatar -DELETE
  

