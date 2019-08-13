# Mock CBT App API
## Table of Contents
1. [General Info](#general-info)
2. [Technologies Used](#technologies-used)
3. [Features](#features)
4. [Inspiration](#inspiration)
5. [Status](#status)
## General Info
A CRUD API using NodeJS, Express and MongoDB as its stack. Allows users to register, login, add/update/delete thoughts including reasons for thoughts. Also provides authentication using JWT which authenticates if a user is logged in and an admin. Admins can view and delete users directly through the API. Also uses other frameworks/libraries for example bcrypt, mongoose and Joi.
## Technologies Used
* JavaScript
* NodeJS/Express
* MongoDB/Mongoose
* Json Web Tokens
* Bcrypt
* Joi
## Features
Currently implemented features:
* Users may register using an email, name and password
* Users may login in using an email and password, returns a JWT for authentication
* Logged in users can create/update/delete/view thoughts. Authenticated through middleware function
* Logged in users can view other users profiles. Authenticated through middleware function
* Admins may view/delete users
* Passwords encrypted using bcrypt
* Data validated using Joi
* Mongoose to create models to be used in the database

Potential future features/additions:
* Implement a front-end to span the full stack of the app
* Rewrite Thought model to more closely relate to CBT
## Inspiration
After attempting to create an API using flask I decided to expand my knowledge to other frameworks. This is the result of me learning how to create an API in NodeJS/Express/MongoDB.
## Status
Currently planning a new implementation of this API which will include more fleshed out features.
