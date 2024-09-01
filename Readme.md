# User and Role management service

A sample service to manage users, roles and users' access to modules

# Table of contents

- [Environment Variables](#environment)
- [Installation](#installtion)
  - [Legacy](#legacy)
  - [Docker](#docker)
- [Read Before Proceeding](#api-reference)

## Environment Variables

To run this project, you will need to add some environment variables to your .env file

modify the provided sample.env file and run the project

## Installation

- [Legacy](#legacy)
- [Docker](#docker)

### Legacy

#### Prerequisites

- Node.js
- MongoDB
- npm
- git

```sh
  git clone https://github.com/inhumanxd/softco-app
  cd softco
  npm install
  npm start
```

## API Reference

When you first run the project

In `softco` database,

There should be a `roles` collection,

And it should have `admin` role with below document values

```json
    "name": "admin",
    "hasAccessTo": [
        "admin"
    ],
    "active": true,
```

After that, you need to create `admin` user

```http
  POST /users
```

| Parameter   | Type                 | Description                        |
| :---------- | :------------------- | :--------------------------------- |
| `firstName` | `string`             | **Required**.                      |
| `lastName`  | `string`             | **Required**.                      |
| `email`     | `valid email string` | **Required**.                      |
| `password`  | `string`             | **Required**.                      |
| `role`      | `string`             | **Required**. Admin role ObjectId. |

After that, you can login using `email` and `password`

```http
POST /auth/login
```

| Parameter  | Type                 | Description   |
| :--------- | :------------------- | :------------ |
| `email`    | `valid email string` | **Required**. |
| `password` | `string`             | **Required**. |

You will get `accessToken` and `refreshToken` in response.

After this point, you should be good to run the project you can refer the provided Postman Collection or the code.
