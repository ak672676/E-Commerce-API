# E-Commerce Shop - Backend
This is a backend for a E-Commerce platform, with the following features.

## Features

* User
    * User Type
        * Admin
        * Customers
    * Auth management
    * Forget Password
* Product management (CRUD)
* Address management (CRUD)
    
## Setup

Please add .env with following varaibles:

1. DB_URI  (Mongo URI)
2. JWT_SECRET  (Secret key)
3. JWT_EXPIRE  (Token expiration time )
4. CLOUDINARY_NAME
5. CLOUDINARY_API_KEY
6. CLOUDINARY_API_SECRET
7. SMPT_HOST= smtp.gmail.com
8. SMPT_PORT= 465
9. SMPT_SERVICE= gmail
10. SMPT_MAIL= Mail Id      
11. SMPT_PASSWORD= Password

## Installation

```bash
npm install
```
```bash
npm run start
```