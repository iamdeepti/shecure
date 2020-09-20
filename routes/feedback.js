const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

router.post(
	"/",
	
	async(req, res) => {
        try{
            //console.log(req);
            const {lighting,ranking,remark,routesWithStreetNames,sentiment}  = req.body;
            // console.log("req");
            // console.log(req.body)
            // console.log(lighting+ranking+remark);
        let feedback = new Feedback({
            lighting,
            ranking,
            remark,
            routesWithStreetNames,
            sentiment
        });
        await feedback.save();
        res.status(200).send(req.body);
    } catch(err){
        // console.log(err);
        res.status(500).send(err.msg);
    }
	}
	
);

module.exports = router;
