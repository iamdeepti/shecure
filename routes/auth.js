const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.post('/signup', (req, res) => {
    User.register(new User({
        email: req.body.email
    }), req.body.password, (err, user) => {
        if (err)
            return res.send(err)
        else
            res.status(200).send(user)
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    if (req.user)
        return res.send(req.user)
    res.sendStatus(403)
});

router.post('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
});

module.exports = router;