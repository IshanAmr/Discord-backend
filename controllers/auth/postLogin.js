const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postLogin = async (req, res) => {
    try {
       const { mail, password } = req.body;
       const user = await User.findOne({ mail : mail.toLowerCase() });

       if(user && (await bcrypt.compare(password, user.password))) {
          // send new token
          const token = jwt.sign({
            userId : user._id,
            mail
         },
         process.env.TOKEN_KEY, {
            expiresIn : "24h"
         });
          return res.status(200).json({
            userDetails : {
                mail : user.mail,
                token : token,
                username : user.username
            }
          })
       }

       res.status(400).json({ message : "Invalide credentials. Please try again " });
    } catch (error) {
        return res.status(500).json({ message : "Login internal server error" });
    }
}

module.exports = postLogin