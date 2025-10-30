import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const register = async (req, res) => {
    const  { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Người dùng đã tồn tại!" });
        }

        const newUser = await User.create({ username, password });

        res.json({
            _id: newUser._id,
            username: newUser.username
        })
    } catch (err) {
        throw err;
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" }),
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        throw err;
    }
}

export {
    register,
    login,
};