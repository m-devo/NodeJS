import express from "express";
import authRouter from "./routes/auth.js";
import query from "./helpers/DB.js"; 
import jwt from "jsonwebtoken";

const app = express(); 
const PORT = 3000;     

//middleware
const authGuard = async (req, res, next) => {
    // console.log("request started");

    try {
        const token = req.headers["authorization"];

        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decodedToken = jwt.verify(token, "verysecret");

        const [user] = await query("SELECT id, name, email, age FROM users WHERE id = ?", [decodedToken.id]);

        if (!user) {
            return res.status(401).json({ error: "User not found." });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ error: "Invalid token." });
    }
};

app.use(express.json());

app.get(["/", "/home"], (req, res) => {
    res.send({ "message": "API is runing" });
});

app.use('/auth', authRouter);

app.use(authGuard); 

app.use("/profile", (req, res) => {
    return res.send({ "userData": req.user }); 
});

app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);
});