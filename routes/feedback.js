const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

router.post(
	"/",
	
	async(req, res) => {
        try{
            //console.log(req);
            const {lighting,ranking,remark}  = req.body;
            //console.log(lighting+ranking+remark);
        let feedback = new Feedback({
            lighting,
            ranking,
            remark
        });
        await feedback.save();
        res.send(req.body);
    } catch(err){
        console.log(err.msg);
    }
	}
	
);

module.exports = router;
