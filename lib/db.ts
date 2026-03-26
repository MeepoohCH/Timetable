import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
console.log("MYSQL_HOST=", process.env.MYSQL_HOST);
console.log("MYSQL_USER=", process.env.MYSQL_USER);
console.log("MYSQL_PASSWORD=", process.env.MYSQL_PASSWORD ? "********" : "NOT SET");
console.log("MYSQL_DATABASE=", process.env.MYSQL_DATABASE);
