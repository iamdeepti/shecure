const express = require("express");
const router = express.Router();
const token = process.env.REACT_APP_TOKEN;

router.post('/',(req,res)=>{
    try{
        res.status(200).send(token);
    }
    catch(err)
    {
        res.status(500).send(err.msg);
    }
});

module.exports = router;
