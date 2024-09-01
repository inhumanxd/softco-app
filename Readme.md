# User and Role management service

A sample service to manage users, roles and users' access to modules

# Table of contents

- [Environment Variables](#environment-variables)
- [Installation](#installation)
  - [Legacy](#legacy)
  - [Docker](#docker)
- [Read Before Proceeding](#api-reference)
- [Information About Modules](#information-about-modules)
- [Additional Information](#additional-information)

## Environment Variables

To run this project, you will need to add some environment variables to your .env file

modify the provided sample.env file, rename it to .env and run the project

## Installation

- [Legacy](#legacy)
- [Docker](#docker)

### Legacy

#### Prerequisites

- Node.js
- MongoDB
- npm
- git

#### Steps

```sh
  git clone https://github.com/inhumanxd/softco-app.git
  cd softco-app
  npm install
  npm start
```

### Docker

#### Prerequisites

- Docker
- Docker Compose
- git

#### Steps

1. **Clone the repository:**

```sh
git clone https://github.com/inhumanxd/softco-app.git
cd softco-app
```

2. **Set up the .env file:**
   modify the provided sample.env file and add your environment variables and rename the file (sample.env) to .env

3. **Build the Docker image:**

```sh
docker compose build
```

4. **Run the Docker container:**

```sh
docker compose up
or
docker compose up -d
```

Use below endpoint to confirm the service status

```http
GET /health-check
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

So, First create this role in your MongoDB Database `softco` under `roles` collection.

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

## Information About Modules

Currently the modules are same as the first part of the base url.

For example,

if the url is: `/users/xyz`, it is users module
if the url is: `/roles/xyz`, it is roles module
if the url is: `/parts/xyz`, it is parts module

You can use

```http
GET /users/[:id]/hasAccessTo?module=[module]
```

| Parameter | Type                   | Description   |
| :-------- | :--------------------- | :------------ |
| `id`      | `string user ObjectId` | **Required**. |
| `module`  | `string`               | **Required**. |

## Additional Information

Refer the provided Postman Collection and you should be good to try all the endpoints.

You can reach out to me if there are any issues or confusion.
