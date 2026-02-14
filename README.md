###Personal Expense Tracker - MERN Stack Application
A full-stack expense tracking application built with MongoDB, Express.js, React.js, and Node.js. Users can securely manage their daily finances with features like authentication, transaction management, and data visualization.

###Features

##Authentication

User registration and login with JWT

Protected routes for authenticated users

Password encryption with bcryptjs

##Dashboard

View total balance, income, and expenses

Category-wise expense breakdown with progress bars

Recent transactions preview

Quick add transaction button

##Transaction Management

Add new transactions (income/expense)

Edit existing transactions

Delete transactions with confirmation

Categories: Food, Rent, Transport, Entertainment, Shopping, Utilities, Healthcare, Education, Salary, Other

Add notes to transactions

##Transaction Explorer

Search transactions by title

Filter by category, type, date range, and amount range

Pagination for large datasets

View all transactions in a clean list

##UI Features

Responsive design for all devices

Toast notifications for user feedback

Loading states and animations

Modern gradient UI with Tailwind CSS

##Tech Stack

##Frontend

React.js 18

React Router DOM 6

Tailwind CSS

Axios for API calls

React Hot Toast for notifications

##Backend

Node.js with Express.js

MongoDB with Mongoose

JWT for authentication

bcryptjs for password hashing

##Installation

##Prerequisites

Node.js (v14 or higher)

MongoDB installed locally or MongoDB Atlas account

Git

##Step 1: Clone the Repository

git clone https://github.com/LokeshMadaka/Bellcorp-Expense-Tracker.git

cd Bellcorp-Expense-Tracker

##Step 2: Backend Setup

cd backend
npm install

##Start backend server:

npm run dev

##Step 3: Frontend Setup
Open new terminal:

cd frontend
npm install
npm start

##Step 4: MongoDB Setup
Ensure MongoDB is running:

*Windows (as Administrator)*
net start MongoDB

##API Endpoints
Authentication

POST	/api/auth/register -> Register new user
POST	/api/auth/login	-> Login user

##Transactions
Method	Endpoint	Description

GET	/api/transactions	-> Get all transactions (with filters)
GET	/api/transactions/summary	-> Get dashboard summary
POST	/api/transactions	-> Create new transaction
PUT	/api/transactions/:id	-> Update transaction
DELETE	/api/transactions/:id -> Delete transaction

##Usage Guide

Register/Login: Create account or login

Dashboard: View financial summary and recent transactions

Add Transaction: Click "Add" button, fill details, submit

Explorer: Click "View All" to search and filter transactions

Edit/Delete: Use buttons next to each transaction

