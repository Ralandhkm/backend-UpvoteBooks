import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";

export const getUser = async(req, res) => {
    try {
        const users = await Users.findAll({
            where:{
                email: req.params.email
            }
        })
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async(req, res) => {
    console.log(req.body);
    const { npm_nis, nama, email, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg:"Password tidak cocok"})
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            npm_nis: npm_nis,
            nama: nama,
            email: email,
            password: hashPassword
        })
        res.json({msg: "Register Berhasil"})
    } catch (error) {
        console.log(error);
    }
}

export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        if(!user[0].is_active){
            return res.status(301).json({msg: "Akun tidak aktif"})
        }
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg:"Password salah"});
        const userId = user[0].id;
        const npm_nis = user[0].npm_nis;
        const nama = user[0].nama; 
        const email = user[0].email;
        const is_super_user = user[0].is_super_user
        const is_admin = user[0].is_admin
        const accessToken = jwt.sign({userId, npm_nis, nama, email, is_super_user, is_admin}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30s'});
        const refreshToken = jwt.sign({userId, npm_nis, nama, email, is_super_user, is_admin}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'});
        await Users.update({refresh_token: refreshToken}, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg: "Email tidak ditemukan"});
    }
}

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id; 
    await Users.update({refreshToken: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}