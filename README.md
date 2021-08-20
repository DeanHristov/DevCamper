# DevCamper
The main idea behind this repo is to show you my ability to work with this kind of technology and how I organize the project and code.

DevCamper support basic functionality like GRUD operations, authentication (JWT/cookies),
grouping users by rules, protecting the endpoints and others.

## Requirements
* [Node](https://nodejs.org/en/) `^14.15.0`
* [Yarn](https://yarnpkg.com/) `^1.22.4` or [NPM](https://www.npmjs.com/) `^6.14.5`

## Installation
After confirming that your environment meets the above [requirements](#requirements), it is time to clone the project locally by doing the following:

```bash
$ git clone https://github.com/DeanHristov/DevCamper.git <project-name>
$ cd <project-name>
```

When you're done with the steps above, you need to install the project dependencies.

```bash
$ npm install #or using 'yarn install' 
```

## Running the Project
Importing **mock** data into DB
```bash
$ npm run importData
```
Removing the data from DB
```bash
$ npm run destroyData
```

Running the app in **development** mode
```bash
$ npm run:dev  # Start the development server or `yarn run:dev`
```
Running the app in **production** mode
```bash
$ npm run:prod  # Start the development server or `yarn run:prod`
```

## Included basic functionality:

### Bootcamps
- List all bootcamps in the database
    * Pagination
    * Select specific fields in result
    * Limit number of results
    * Filter by fields
- Search bootcamps by radius from zipcode
    * Use a geocoder to get exact location and coords from a single address field
- Get single bootcamp
- Create new bootcamp
    * Authenticated users only
    * Must have the role "publisher" or "admin"
    * Only one bootcamp per publisher (admins can create more)
    * Field validation via Mongoose
- Upload a photo for bootcamp
    * Owner only
    * Photo will be uploaded to local filesystem
- Update bootcamps
    * Owner only
    * Validation on update
- Delete Bootcamp
    * Owner only
- Calculate the average cost of all courses for a bootcamp
- Calculate the average rating from the reviews for a bootcamp

### Courses
- List all courses for bootcamp
- List all courses in general
    * Pagination, filtering, etc
- Get single course
- Create new course
    * Authenticated users only
    * Must have the role "publisher" or "admin"
    * Only the owner or an admin can create a course for a bootcamp
    * Publishers can create multiple courses
- Update course
    * Owner only
- Delete course
    * Owner only

### Reviews
- List all reviews for a bootcamp
- List all reviews in general
    * Pagination, filtering, etc
- Get a single review
- Create a review
    * Authenticated users only
    * Must have the role "user" or "admin" (no publishers)
- Update review
    * Owner only
- Delete review
    * Owner only

### Users & Authentication
- Authentication will be ton using JWT/cookies
    * JWT and cookie should expire in 1 hour
- User registration
    * Register as a "user" or "publisher"
    * Once registered, a token will be sent along with a cookie (token = xxx)
    * Passwords must be hashed
- User login
    * User can login with email and password
    * Plain text password will compare with stored hashed password
    * Once logged in, a token will be sent along with a cookie (token = xxx)
- User logout
    * Cookie will be sent to set token = none
- Get user
    * Route to get the currently logged in user (via token)
- Password reset (lost password)
    * User can request to reset password
    * A hashed token will be emailed to the users registered email address
    * A put request can be made to the generated url to reset password
    * The token will expire after 10 minutes
- Update user info
    * Authenticated user only
    * Separate route to update password
- User CRUD
    * Admin only
- Users can only be made admin by updating the database field manually

### Security
- Encrypt passwords and reset tokens
- Prevent cross site scripting - XSS
- Prevent NoSQL injections
- Add a rate limit for requests of 100 requests per 10 minutes
- Protect against http param polution
- Add headers for security (helmet)
- Use cors to make API public (for now)

## Documentation
- Use Postman to create documentation
- Use docgen to create HTML files from Postman
- Add html files as the / route for the api

## Deployment (Digital Ocean)
- Push to Github
- Create a droplet  
- Clone repo on to server
- Use PM2 process manager
- Enable firewall (ufw) and open needed ports 
- Connect a domain name
- Install an SSL using Let's Encrypt

## Code Related Suggestions
- NPM scripts for dev and production env
- Config file for important constants
- Use controller methods with documented descriptions/routes
- Error handling middleware
- Authentication middleware for protecting routes and setting user roles
- Validation using Mongoose and no external libraries
- Use async/await (create middleware to clean up controller methods)
- Create a database seeder to import and destroy data

# Main tasks

All tasks automation are based on [NPM scripts](https://docs.npmjs.com/misc/scripts).

Tasks              | Description
------------------ |---------------------------------------------------------------------------------------
npm run dev          | Run in **dev** mode
npm run prod         | Run in **prod** mode
npm run importData   | Import mock data
npm run destroyData  | Destroy the all data

## Tools

- Node.js - https://nodejs.org/en/ 
- Postman - https://www.getpostman.com/
- Git - https://git-scm.com/
- MongoDB - https://www.mongodb.com/
- MailTrap - https://mailtrap.io/
- Docgen - https://github.com/thedevsaddam/docgen
- MapQuest Dev API - https://developer.mapquest.com/

## NPM Packages

- [dotenv](https://github.com/motdotla/dotenv#readme)
- [morgan](https://github.com/expressjs/morgan)
- [colors](https://github.com/Marak/colors.js)
- [slugify](https://github.com/simov/slugify)
- [node-geocoder](https://github.com/nchaulet/node-geocoder)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js#readme)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [nodemailer](https://nodemailer.com/about/)
- [express-mongo-sanitize](https://github.com/fiznool/express-mongo-sanitize#readme)
- [xss-clean](https://github.com/jsonmaur/xss-clean)
- [helmet](https://helmetjs.github.io/)
- [hpp](https://github.com/analog-nico/hpp)
- [express-rate-limit](https://github.com/nfriedly/express-rate-limit)
- [cors](https://github.com/expressjs/cors)
- [pm2](https://github.com/Unitech/pm2)

## Helpful resources

- [ExpressJS](https://expressjs.com/)
- [MongooseJS](https://mongoosejs.com/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [Promises in JavaScript](https://zellwk.com/blog/js-promises/)
- [JavaScript async and await](https://zellwk.com/blog/async-await/)
- [Using Async/await in Express](https://zellwk.com/blog/async-await-express/)
- [DRY in Express middlewares](https://www.acuriousanimal.com/blog/20180315/express-async-middleware)
- [Best practices for REST API design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
- [Hacking NodeJS and MongoDB](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html)

## Made by 
- Author: [D. Hristov](https://dhristov.eu/) | Version: [1.0.0]() | Documentation [here]() |  License: [MIT](https://opensource.org/licenses/MIT)
