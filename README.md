# Task-RestAPI
A Representational State Transfer Application Package Interface for Task manager.

## Installing
`npm i `  to install all the dependencies
`npm run dev` to run the application on server.
`npm run test` to run the tests on the application.

## Overview
The task manager api sends a Welcome and Farewell message whenever user creates or delete his/her profile. 
Passwords are stored in hased form using bcrypt encryption with 10 salt rounds. Token based authentication is
implemented using Json Web Token, and every route except sign-up and sign-in required authentication to perform.
Jest framework is used for testing.


## Features
  - Create new user
  - Login user
  - Create tasks: Authentication required.
  - Upload a profile pic: Authentication required
  - Get Profile details : Authentiation required
  - Get tasks of a particular user: Authentication required
  - Update profile details: Authentication required.
  - Update task description: Authentication required.
  - Delete Profile: Authentication required.
  - Delete Tasks: Authentication required.
  

