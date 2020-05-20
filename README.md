# Springboard

Welcome this project is a springboard to getting started with a new project. 

It's a mono repo that uses yarn workspaces to share code and types between Frontend and Backend. 

## Frontend - App
The frontend uses Preact with Material UI and Styled-Components, and is built using Parcel.js. It has unit tests with Jest and e2e test with Cypress.

It runs on port `3000` and can start project by running `./run start` in app directory.

## Backend - Server
THe backend is using Express and Mongo, it has Role Based Access examples and unit-, e2e-tests examples.

It runs on port `3005` and can start project by running `./run start` in server directory 
> Requires Mongo running before starting which can be done by running `./run dependencies`


## Demo
![preview](./springboard.gif)   