# TRUEQUE

## Trueque is a item exchange platform, where users can upload items and search for items they want to swap!

## Technologies

- Next.js
- TypeScript
- JavaScript
- PostgreSQL
- TailwindCSS
- Jest unit tests
- Cypress E2E tests
- FIGMA
- DrawSQL

## Setup instructions

- Clone the repository with `git clone <repo>`
- Setup the database by downloading and installing PostgreSQL
- Create a user and a database
- Create a new file `.env`
- Copy the environment variables from `.env-example` into `.env`
- Replace the placeholders xxxxx with your username, password and name of database
- Install dotenv-cli with `yarn add dotenv-cli`
- Run `yarn install` in your command line
- Run the migrations with `yarn migrate up`
- Start the server by running `yarn dev`

## Deploy on Heroku

- Sign up at Heroku: https://www.heroku.com/.
- Create a new App
- Choose a name and select the "Europe" Region
- Click "Connect to GitHub"
- Search for your repository and click on "Connect". Click on "Enable Automatic Deploys"
- Go to the Overview tab and click "Configure Add-On"
- Search for "Postgres" and select "Heroku Postgres"
- Trigger a deploy by pushing your repo to GitHub
