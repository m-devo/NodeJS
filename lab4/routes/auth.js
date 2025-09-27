import express from "express";
import query from "../helpers/DB.js";
import jwt from "jsonwebtoken";
import joi from "joi";
import bcrypt from "bcrypt";

const authRouter = express.Router(); 

const registerSchema = joi.object({
    name: joi.string().min(2).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    age: joi.number().integer().min(13).max(120).required()
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

authRouter.post("/register", async (req, res) => {

    const validationResult = registerSchema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({
            error: validationResult.error.details[0].message
        });
    }

    let { name, password, email, age } = req.body;

    let existEmail = await query("SELECT * FROM users WHERE email = ?", [email]);

    if (existEmail.length > 0) {
        return res.status(409).json({
            error: "this email has been taken before: please use another one"
        });
    }

    const encryptedPass = await bcrypt.hash(password, 10);

    const result = await query(
        "INSERT INTO users (name, password_hash, email, age) VALUES(?, ?, ?, ?)",
        [name, encryptedPass, email, age]
    );

    if (!result) {
        return res.status(500).send({ error: "server error" });
    }

    if (result.tragetedRows === 0) {
        
        return res.status(404).send({ error: "No records are found" });
    }

    res.status(201).send({
        "status": "created successfully",
        "user_info": { name, email, age } 
    });
});

authRouter.post("/login", async (req, res) => {
    const validationResult = loginSchema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({
            error: validationResult.error.details[0].message
        });
    }

    let { email, password } = req.body;
    
    const userResult = await query("SELECT * FROM users WHERE email = ?", [email]);

    if (userResult && userResult.length > 0) {
        const user = userResult[0];
        const passwordComparision = await bcrypt.compare(password, user.password_hash);

        if (passwordComparision) {
            const token = jwt.sign({ id: user.id, email: user.email }, "verysecret", { expiresIn: "1h" });
            // console.log("token: ", token);
            res.send({ userToken: token }); 
        } else {
            res.status(401).send({ error: "" });
        }
    } else {
        res.status(400).send({ error: "User not found." });
    }
});

export default authRouter;