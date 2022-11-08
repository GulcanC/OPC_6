
## Project 6 | OpenClassrooms | Construisez une API sécurisée pour une application d'avis gastronomiques

## ✴️ The Purpose of the Project

1. Creating back-end of this project to build an API (The front-end of the application was developed using Angular)
2. Creating a logical data model and translating it into the API 
3. Ipmlementing CRUD fonctionalty, Create, Read, Update, and Delete
4. Storing data in the database mongoDB
5. Protecting data stored on an app (OWASP/RGPD)
6. Creating a user, verifying and securing the user's session

## ✴️ About the Project

In this project, we can create a user using a password and email address. This user can like, dislike or unlike the sauces created by other users, but cannot make any changes or delete these sauces. Users can create their own sauces and only delete or modify their own sauce. The user can log out and reconnect using her/his password and email address.

## ✴️ The Technologies used

✳️ Node.js ✳️ Express ✳️ MongoDB ✳️ API REST 

## ✴️ Project Backend Setup

1. Open a terminal at the root of the project

2. Run the following command to reach the directory "backend"

```
cd backend
```
3. Install the dependencies

```
npm install
```
4. Create a project in mongoDB, specify a user with a specific username and password, and create a cluster
5. Create a folder with name of "vars" in the repository "backend", inside "vars" create a file ".env" likes the file .env.example and write the following informations using your own data in this file. [backend/vars/.env]

```
PORT=3000
DB_USERNAME="your mongoDB user name"
DB_PWD="your mongoDB user password"
DB_CLUSTER="your mongoDB cluster name"
JWT_KEY_TOKEN="Create an API token"
```
7. In this file, write your own MongoDB project user name, password and cluster name
8. Generate your own API token and write it also in the file .env for JWT_KEY_TOKEN
9. Run backend server with this command

```
npm start
```
## ✴️ Project Frontend Setup

1. Open a terminal at the root of the project

2. Run the following command to reach the directory "frontend"

```
cd frontend
```
3. Install the Dependencies

```
npm install
```
4. Run frontend server with this command

```
npm run start
```

5. Type the following URL in your browser to reach the application

👉 http://localhost:4200/

## ✴️ Password Validation

Password must be 6 characters: 

:star: 1 uppercase letter
:star: 1 lowercase letter
:star: 1 special character
:star: 3 digits

