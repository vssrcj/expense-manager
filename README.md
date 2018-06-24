# Expense Tracker

*made by [CJ](https://github.com/vssrcj)*

# Overview.

This project allows the creation, editing, and deleting of your expenses after you have logged in.  Admin may also manage the user 
. 

## How to run.

1. Clone the repo.
2. Install all the dependencies with **yarn**.  Navigate to the root of the project, and run:
   ```
   yarn
   ```
3. Start the application by running:
   ```
   yarn start
   ```

# Project structure.

This project essenstially consists of two seperate projects:

**client** and **server**

The root of this project basically wrapped these two projects, and allows them to run simultaneously.

## Client.

The client is a web application made with React, and bootstrapped with create-react-app.

All the routes in app is validated (**auth.js**) by looking at the token stored in localStorage.  This token is retrieved by the Signup, or Login screens.

The app runs on port 3000, but proxies the requests through port 5000 (the api's port).

## Server.

The server is a REST web api made with Node, Express, and Sqlite.

**server.js** is the root file that sets up the web server.

You can run tests in this project (or from the root project) by running:
   ```
   yarn test
   ```

The tests test the whole server, including:
* Making sure all the routes exist.
* Making sure the requests lead to the correct values in the store.
* Validating the requests.
* Authenticating the routes based on roles.
