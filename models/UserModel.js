import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    npm_nis:{
        type: DataTypes.STRING
    },
    nama:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    universitas:{
        type: DataTypes.STRING
    },
    jurusan:{
        type: DataTypes.STRING
    },
    buku_vote:{
        type: DataTypes.INTEGER
    },
    buku_request:{
        type: DataTypes.STRING
    },
    refresh_token:{
        type: DataTypes.TEXT
    }
},{
    freezeTableName:true
})

export default Users