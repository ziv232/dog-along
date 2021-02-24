const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../utils/auth');
const authRefresh = require('../../utils/authRefresh');
const User = require('../../models/user');
const RefreshToken = require('../../models/refreshToken');



router.post('/register', async (req, res) => {
    try{
    const {username, password, passwordCheck, displayName} = req.body;

    if(!username || !password || !passwordCheck || !displayName)
        return res.status(400).json({msg: 'You have to fill all the fields!'});
    if(password !== passwordCheck)
        return res.status(400).json({msg: 'The password and check password are not the same!'});

    const existUser = await User.findOne({username: username});
    if(existUser)
        return res.status(400).json({msg: 'User is already exist, Please try another username'});
    
    //encrypt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //Creating new user
    const newUser = new User({
        username,
        password: hashedPassword,
        displayName,
    })
    const saveUser = await newUser.save();
    res.json(saveUser);

    } catch (err) {
        res.status(500).json({error: err.message});
    }
    
})

router.post('/login', async (req, res) => {
    try{
        const {username, password} = req.body;

        if(!username || !password)
            return res.status(400).json({msg: 'You need to fill all the fields'});
        
        const user = await User.findOne({username: username});
        if(!user)
            return res.status(400).json({msg: 'There is no account with that username'});
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(400).json({msg: 'Incorrect password'});
        // await RefreshToken.deleteMany({userId: user._id}, function(err, result) {
        //     if (err) {
        //       res.send(err);
        //     } else {
        //       res.send(result);
        //     }
        // })
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_1,{expiresIn: '20s'});
        const refreshToken = jwt.sign({id: user._id}, process.env.JWT_SECRET_2, {expiresIn: '1d'});
        //Saving the refreshToken
        const newRefreshToken = new RefreshToken({
            userId: user._id,
            token: refreshToken
        })
        //Deleting old refresh tokens
        const deleteOldTokes = await RefreshToken.deleteMany({
            userId: user._id
        });

        const saveRefreshToken = await newRefreshToken.save();
        if(!saveRefreshToken){
            return res.status(400).json({msg: 'There was a problem logging in'})
        }

        res.json({token,
        user: {
            id: user._id,
            username: user.username,
            displayName: user.displayName
        },
    })
    } catch(err){
        res.status(500).json({error: err.message});
    }
})

router.post('/logout', auth , async (req, res) => {
    try{
        const {username} = req.body;
        const user = await User.findOne({username: username});
        await RefreshToken.deleteMany({userId: user._id}, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        })
    } catch(err) {
        res.status(500).json({error: err.message});
    }
})

router.delete('/delete', auth, async (req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json({msg: `Username: ${deletedUser.username} was deleted`});

    } catch(err){
        res.status(500).json({error: err.message});
    }
})

router.post('/tokenIsValid', async (req, res) => {
    try{
        const token = req.header('x-auth-token');
        if(!token)
            return res.json(false);
        const verifying = jwt.verify(token, process.env.JWT_SECRET_1);
        if(!verifying)
            return res.json(false);
        const user = await User.findById(verifying.id);
        if(!user)
            return res.json(false);

        return res.json({isValid: true, id: verifying.id});
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({username: user.username,
    displayName: user.displayName,
    id: user._id
    });
});

router.post('/newToken', authRefresh, async (req, res) => {
    try{
        const token = jwt.sign({id: req.user}, process.env.JWT_SECRET_1,{expiresIn: '15s'});
        const user = await User.findById(req.user);
        res.json({token, user: {
            id: user._id,
            username: user.username,
            displayName: user.displayName
            } 
         });
    } catch(err) {
        res.status(400).json({msg: 'Could not generate new access token'});
    }
});


module.exports = router;
