import bcrypt from "bcrypt";

import config from "../../Common/services/configService.js";
import User from "../models/user.js";

const verifyToken = async (req, res, next) => {
    let token = req.headers["x-acces-token"];

    if (!token) {
        const { username, password } = req.body;
        const user = await User.findOne({
            user: username,
        });
        if (user) {
            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password,
            );
            if (!isPasswordCorrect) {
                return res.status(401).send({ message: "Unathorized." });
            } else {
                const token = jwt.sign(
                    { userId: user.id, username: user.username },
                    config.jwt.secret,
                    { expiresIn: "1h" },
                );
                req.user = user; //add user to req object
            }
        } else {
            return res.status(401).send({ message: "Unathorized." });
        }
    } else {
        jwt.verify(token, config.jwt.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unathorized." });
            }
            next();
        });
    }
};

export default verifyToken;
