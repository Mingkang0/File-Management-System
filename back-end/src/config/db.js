
const dotenv = require("dotenv");

dotenv.config();
const { Client } = require("pg");

console.log('PG_USER:', process.env.PG_USER);
console.log('PG_HOST:', process.env.PG_HOST);
console.log('PG_PASSWORD:', process.env.PG_PASSWORD);
console.log('Current Directory:', process.cwd());

const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

client.connect().then(() => {
  console.log("Connected to the database");
}).catch((err) => {
  console.log("Error connecting to the database", err);
});

module.exports = client;