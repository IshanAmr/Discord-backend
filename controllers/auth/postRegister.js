const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const postRegister = async (req, res) => {
    try { 
       const { username, mail, password } = req.body;

       const userExists = await User.exists({ mail : mail.toLowerCase() });
       if(userExists) return res.status(409).json({ message : "Email already in use" });

       const encryptedPassword = await bcrypt.hash(password, 10);

       //create user document and save in db
       const user = await User.create({
          username,
          mail : mail.toLowerCase(),
          password : encryptedPassword
       })

       //return JWT token 
       const token = jwt.sign({
          userId : user._id,
          mail
       },
       process.env.TOKEN_KEY, {
          expiresIn : "24h"
       })

       res.status(201).json({userDetails : {
        mail : user.mail,
        token : token,
        username : user.username
    }})

    } catch (error) {
        return res.status(500).json({ message : "Failure in registering user" });
    }
}

module.exports = postRegister;

