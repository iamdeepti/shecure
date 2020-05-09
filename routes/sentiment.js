const express = require("express");
const router = express.Router();

var Sentiment = require('sentiment');
 //let feedback_data =[];
// fs.createReadStream("/home/deepti/Desktop/ShECURE-1-master/feedbackDataset.csv")
// 		.pipe(csv())
// 		.on("data", data => feedback_data.push(data))
// 		.on("end", () => {
//             //console.log(street_data[1]);
//             //var feedback = feedback_data[0];
//             let feedback = [];
//             for(i in feedback_data)
//             {
//                 //console.log(i);
//                 if(feedback_data[i]['Remarks']!=='')
//                 feedback.push(feedback_data[i]['Remarks']);
//             }
//             //console.log(feedback);
//             var options = {
//                 extras: {
//                   'safe': 5,
//                   'unsafe': -5,
//                   'uncomfortable':-3,
//                   'dark':-4,
//                   'not safe':-4,
//                   'not': -3,
//                   'low':-1,
//                   'uncrowded':-3,
//                   'crowded': 3,
//                   'secure': 5,
//                   'unsecure':-5,
//                   'compromised':-1,
//                   'alcohol':-2,
//                   'tobacco':-2,
//                   'shops':1,
//                   'lit':3,
//                   'few':-1,
//                   'molesters': -3,
//                   'thief':-2,
//                   'thieves':-2,
//                   'mishappening':-2,
//                   'secluded':-2,
//                   'less':-1,
//                   'cctv':2,
//                   'police':2,
//                   'dim':-2,
//                   'remote':-1,
//                   'sparsely':-1,
//                   'risky':-2,
//                   'shady':-3,
//                   'desserted':-2,
//                   'alone':-2,
//                   'populated':2,
//                   'busy':2
//                 }
//               };
//             let safety=[];
//             for( i in feedback)
//             {
//                 var result = sentiment.analyze(feedback[i], options);
//                 if(result['words'].length!==0)
//                 safety.push(result['score']/result['words'].length)
//                 else
//                 safety.push(0);
//                 //console.log(safety[i]);
//                 //console.log(result);
//                 // console.log(feedback[i]+" scores :" + result['score']);
//                 console.log(feedback[i]+" scores :" + safety[i]);
//                 if(safety[i]<0)
//                     //unsafe
//                     console.log('unsafe');
//                 else
//                     console.log('safe');
//             }

//         });
                //console.log(street_data[1]);
                //var feedback = feedback_data[0];
router.post('/',(req,res)=>{
  var sentiment = new Sentiment();

  var options = {
    extras: {
      'safe': 5,
      'unsafe': -5,
      'uncomfortable':-3,
      'dark':-4,
      //'not safe':-4,
      'not': -3,
      'low':-1,
      'uncrowded':-3,
      'crowded': 3,
      'secure': 5,
      'unsecure':-5,
      'compromised':-1,
      'alcohol':-2,
      'tobacco':-2,
      'shops':1,
      'lit':3,
      'few':-1,
      'molesters': -3,
      'thief':-2,
      'thieves':-2,
      'mishappening':-2,
      'secluded':-2,
      'less':-1,
      'cctv':2,
      'police':2,
      'dim':-2,
      'remote':-1,
      'sparsely':-1,
      'risky':-2,
      'shady':-3,
      'desserted':-2,
      'alone':-2,
      'populated':2,
      'busy':2
    }
  }
  var predictedSentiment = sentiment.analyze(req.body.remarks,options);
  if(predictedSentiment['words'].length!==0)
    predictedSentiment = predictedSentiment['score']/predictedSentiment['words'].length ;
  else
    predictedSentiment = 0;
  res.json(predictedSentiment);
});
module.exports = router;
                