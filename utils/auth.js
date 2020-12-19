const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try{
    const token = req.header('x-auth-token');

    //Authenticating
    if(!token)
        return res.status(401).json({msg: 'Unauthrized request!'});
    const verifying = jwt.verify(token, process.env.JWT_SECRET_1);
    if(!verifying)
        return res.status(401).json({msg: 'You are not authrized!'});

    //Authenticated
    req.user = verifying.id;
    next();


    } catch(err){
        res.status(500).json({error: err.message});
    }
}

module.exports = auth;