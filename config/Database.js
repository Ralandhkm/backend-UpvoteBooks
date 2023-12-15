import { Sequelize } from "sequelize";

const db = new Sequelize('upvote_db','root','',{
    host: "localhost",
    dialect: "mysql"
});

export default db;