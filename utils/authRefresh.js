const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshToken');


const authRefresh = async (req, res, next) => {
    try{
        const id = req.body;
        const token = await RefreshToken.findOne({
            userId: id.id
        })
        if(!token)
        return res.status(401).json({msg: 'Unauthrized request!'});
        const verifying = jwt.verify(token.token, process.env.JWT_SECRET_2);
    if(!verifying)
        return res.status(401).json({msg: 'You are not authrized!'});

    req.user = verifying.id;
    next();

    } catch(err) {
        res.status(500).json({error: err.message});
    }
}
module.exports = authRefresh;