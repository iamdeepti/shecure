// import React from "react";
// import PropTypes from "prop-types";
const express = require("express");
const router = express.Router();
const csv = require("csv-parser");
const fs = require("fs");
// const streetmlalgo = ({ routesWithStreetNames }) => {
	// state={ street_data : []
	// ,
	// encode: null}
	// try {
	// 	const user = await User.findById(req.user.id).select('-password');
	// 	res.json(user);
	//   } catch (err) {
	// 	console.error(err.message);
	// 	res.status(500).send('Server Error');
	//   }
router.post('/',(req,res)=>{
	try{
		var output;
		const {routesWithStreetName} = req.body;
		var safetyScores = [];
		var street_data = [];
		function encode(x) {
			x = Number(x);
			if (x === 1) x = 4;
			else if (x == 2) x = 1;
			else if (x == 0) x = 3;
			else x = 2;
			return x;
		}
	
		fs.createReadStream("./streets.csv")
			.pipe(csv())
			.on("data", data => street_data.push(data))
			.on("end", () => {
				//console.log(street_data[1]);
	
				//console.log(x);
	
				//----->PLACE VARIABLE TEMP HERE TO MOCK RESPONSE<----//
	
				var keywords = [" rd", " marg", " flyover", " expressway", "road"];
	
				//-->UNCOMMENT THE LINE BELOW IF USING TEMP<--//
				//var routes=temp['routesWithStreetName'];
				//props;
				//var routes = routesWithStreetNames;
				//console.log(routes);
				//console.log(req.body['routesWithStreetName']);
				
				//console.log(routesWithStreetName);
				//console.log(routesWithStreetName);
				const routes = routesWithStreetName;
				var rc = 0,
					route,
					i,
					j;
				//for each selected route
				for (i in routes) {
					var roads = [];
					rc += 1;
					//console.log(i);
					route = routes[i];
					//console.log("hien"+routes[route]);
					//all places in route
					var place;
					for (j in route) {
						place = route[j];
						//console.log(place);
						place = place.toLowerCase();
						place = place.replace(" rd", " road");
						place = place.replace(".", " ");
						// extracting different areas in a place
						var places = place.split(",");
						//console.log(places);
						var k, p, l;
						for (k in places) {
							p = places[k];
							var key;
							for (l in keywords) {
								key = keywords[l];
								if (p.search(key) != -1) {
									p = p.replace(key, "");
									//console.log("hiiii"+p);
									if (
										roads.findIndex(function(ele) {
											return ele === p;
										}) == -1
									) {
										roads.push(p); //console.log("hiiii");
									}
									break;
								}
							}
						}
					}
					//roads=np.unique(roads)
					console.log("roads : "+roads);
					var c = 0;
					var safety = 0;
					// main_file = pd.read_csv('streets.csv', encoding='ISO-8859-1')
					// main_file=np.array(main_file)
					var streets = [];
					//console.log(street_data);
					for (var i = 1; i < street_data.length; i++) {
						streets.push(street_data[i]["Sreet name"]);
					}
					//console.log(streets);
					var road, street;
					for (i in roads) {
						road = roads[i];
						//console.log(road);
						for (j in streets) {
							street = streets[j];
							//road=str(road)
							//street=str(street)
							if (street.search(road) != -1) {
								var ele = streets.findIndex(function(element) {
									return element === street;
								});
								//console.log(street);
								safety += encode(street_data[ele]["safety"]);
								c += 1;
								break;
							}
						}
					}
					//safety score
					//console.log(c);
					if (c != 0) {
						//console.log(safety);
						safety = safety / c;
					} else safety = 2.0;
					//console.log("safety " + safety);
					//saving the results in the database
					//collection = db.pred_routes
					// output = {
					// "route": 'Route ' + str(rc),
					// "score": str(safety)
					// }
					// output = {
					// 	"score":String(safety)
					// }
					safetyScores.push(safety);
				}
				//console.log(safetyScores);
				output = {
					"scores" : safetyScores
				}
				//console.log("initial out"+output);
				console.log(safetyScores);
				res.json(safetyScores);
			});
			
			// console.log("output "+output);
			// console.log("safety scores"+safetyScores);
			// res.json(safetyScores);
		}
			catch(err){
				console.log(err.message);
				res.status(500).send('SERVER ERROR');
			}
});
	module.exports = router;
// };

// export default streetmlalgo;

// var temp = {
//   "viewport": {
//     "latitude": 28.632800000000003,
//     "longitude": 77.21980000000005,
//     "zoom": 9.642615526813847,
//     "width": 620,
//     "height": 558,
//     "bearing": 0,
//     "pitch": 0,
//     "altitude": 1.5,
//     "maxZoom": 24,
//     "minZoom": 0,
//     "maxPitch": 60,
//     "minPitch": 0,
//     "transitionDuration": 300,
//     "transitionEasing": "transitionEasing()",
//     "transitionInterpolator": "Object",
//     "transitionInterruption": 1
//   },
//   "searchResultLayerSource": {
//     "props": "Object",
//     "id": "search-result-source",
//     "count": 4,
//     "lifecycle": "Matched. State transferred from previous layer",
//     "parent": null,
//     "context": "Object",
//     "state": "Object",
//     "internalState": "Object"
//   },
//   "searchResultLayerDestination": {
//     "props": "Object",
//     "id": "search-result-destination",
//     "count": 6,
//     "lifecycle": "Matched. State transferred from previous layer",
//     "parent": null,
//     "context": "Object",
//     "state": "Object",
//     "internalState": "Object"
//   },
//   "source": [
//     77.117187,
//     28.749271
//   ],
//   "destination": [
//     77.2198,
//     28.6328
//   ],
//   "routes": {
//     "routes": "Array[3]",
//     "waypoints": "Array[2]",
//     "code": "Ok",
//     "uuid": "ck2ryop3i006h3usb84t65npd"
//   },
//   "latlongArray": [
//     "Array[1]",
//     "Array[1]",
//     "Array[1]"
//   ],
//   "routesWithStreetName": [
//     [ "akbar road",
//       "aruna asaf ali marg",
//       "barakhamba road",
//       "mathura road",
//       "iit flyover",
//       "Delhi Technological University Delhi College Of Engineering, Bawana Auchandi Rd, Rohini, New Delhi, Delhi, India",
//       "Shahbad Daulatpur, New Delhi, North West Delhi, Delhi, India",
//       "Guru Nanak Industrial Area, New Delhi, North West Delhi, Delhi, India",
//       "Guru Nanak Industrial Area, New Delhi, North West Delhi, Delhi, India",
//       "Rohini Sector 16, New Delhi, North West Delhi, Delhi, India",
//       "Rohini Sector 18, New Delhi, North West Delhi, Delhi, India",
//       "Vivekananda Institute of Professional Studies, AU Block, Pitampura, New Delhi, Delhi, India",
//       "Vivekananda Institute of Professional Studies, AU Block, Pitampura, New Delhi, Delhi, India",
//       "Vivekananda Institute of Professional Studies, AU Block, Pitampura, New Delhi, Delhi, India",
//       "Pizza Hut, G 19 & 20, Gr Flr, Fun City Mall, Prashant Vihar, New Delhi, Delhi, India",
//       "24 SEVEN, SN AB 13, Gr Flr, Azadpur Metro Station, Opp AD Mkt, New Delhi, Delhi, India",
//       "24 SEVEN, SN AB 13, Gr Flr, Azadpur Metro Station, Opp AD Mkt, New Delhi, Delhi, India",
//       "DT Cinemas, Shalimar Bagh, New Delhi, Delhi, India",
//       "All Heavens, B-97, Wazirpur, Ring Road, New Delhi, Delhi, India",
//       "The Mohans, Deep Market, New Delhi, Delhi, India",
//       "Mall TVR, Opposite Invitation Restaurant, New Delhi, Delhi, India",
//       "Cafe Coffee Day, Ashok Vihar, New Delhi, Delhi, India",
//       "Horilal Pan Shop, Block B DDA Market Phase 3, New Delhi, Delhi, India",
//       "Sardar, 16 Block J DDA Market Ashok Vihar Ph 1, New Delhi, Delhi, India",
//       "Sardar, 16 Block J DDA Market Ashok Vihar Ph 1, New Delhi, Delhi, India",
//       "Ashok Vihar Phase 3, New Delhi, North Delhi, Delhi, India",
//       "Ashok Vihar Phase 3, New Delhi, North Delhi, Delhi, India",
//       "Gulabi Bagh, New Delhi, North Delhi, Delhi, India",
//       "Gulabi Bagh, New Delhi, North Delhi, Delhi, India",
//       "Gulabi Bagh, New Delhi, North Delhi, Delhi, India",
//       "Roshanara Club, Roshanara Gardens, New Delhi, Delhi, India",
//       "Roshanara Club, Roshanara Gardens, New Delhi, Delhi, India",
//       "Khushdil Kulfi & Milk Bar, New Delhi, Delhi, India",
//       "Khushdil Kulfi & Milk Bar, New Delhi, Delhi, India",
//       "Khushdil Kulfi & Milk Bar, New Delhi, Delhi, India",
//       "Bara Hindu Rao, New Delhi, Delhi, India",
//       "Bara Hindu Rao, New Delhi, Delhi, India",
//       "Jhandewalan Temple, New Delhi, Delhi, India",
//       "Hotel Toronto, New Delhi, Delhi, India",
//       "Bikaner Sweets Corner, New Delhi, Delhi, India",
//       "Star Plaza Hotel, 5158, Main Bazar, Pahar Ganj, Behind R. K. Ashram Metro Station, New Delhi, Delhi, India",
//       "Northern Railway Central Hospital, Basant Lane, Connaught Place, New Delhi, Delhi, India",
//       "Northern Railway Central Hospital, Basant Lane, Connaught Place, New Delhi, Delhi, India",
//       "Veda Restaurant, H 27, New Delhi, Delhi, India",
//       "Khub Chand & Bros, New Delhi, Delhi, India",
//       "Connaught Place  कनॉट प्लेस, Connaught Place, New Delhi, Delhi, India"
//     ],
//     [
//       "Delhi Technological University Delhi College Of Engineering, Bawana Auchandi Rd, Rohini, New Delhi, Delhi, India",
//       "Shahbad Daulatpur, New Delhi, North West Delhi, Delhi, India",
//       "Guru Nanak Industrial Area, New Delhi, North West Delhi, Delhi, India",
//       "Guru Nanak Industrial Area, New Delhi, North West Delhi, Delhi, India",
//       "Rohini Sector 16, New Delhi, North West Delhi, Delhi, India",
//       "Rohini Sector 18, New Delhi, North West Delhi, Delhi, India",
//       "Rohini Sector 19, New Delhi, North West Delhi, Delhi, India",
//       "Badli, New Delhi, North West Delhi, Delhi, India",
//       "Rohini Sector 19, New Delhi, North West Delhi, Delhi, India",
//       "Passport Seva Kendra (PSK)  पासपोर्ट सेवा केन्द्र, Aggarwal Auto mall, New Delhi, Delhi, India",
//       "Shalimar Bagh Paschimi, New Delhi, North West Delhi, Delhi, India",
//       "Shalimar Bagh Paschimi, New Delhi, North West Delhi, Delhi, India",
//       "Shalimar Bagh Paschimi, New Delhi, North West Delhi, Delhi, India",
//       "Jahangirpuri Metro Station  जहांगीरपुरी, New Delhi, Delhi, India",
//       "Jahangirpuri Metro Station  जहांगीरपुरी, New Delhi, Delhi, India",
//       "Jahangirpuri Metro Station  जहांगीरपुरी, New Delhi, Delhi, India",
//       "Jahangirpuri Metro Station  जहांगीरपुरी, New Delhi, Delhi, India",
//       "Adarsh Nagar Metro Station, New Delhi, Delhi, India",
//       "Speedway Surgical Company, 67/5 Block A, Industrial Area, New Delhi, Delhi, India",
//       "24 SEVEN, F14/13, Nr Malikapur Village, New Delhi, Delhi, India",
//       "Diet Clinic Gujranwala Town North Delhi, 224, Gujranwala Town, part 3, New Delhi, Delhi, India",
//       "Grand Venizia, New Delhi, Delhi, India",
//       "Kirpal Ashram, Sant Kirpal Singh Marg, New Delhi, Delhi, India",
//       "Kirpal Ashram, Sant Kirpal Singh Marg, New Delhi, Delhi, India",
//       "Spark Kamla Nagar, Central Round About, New Delhi, Delhi, India",
//       "Ved Dhaba, Near Malkaganj Chowk, New Delhi, Delhi, India",
//       "Manohar Bikaneri, New Delhi, Delhi, India",
//       "Khushdil Kulfi & Milk Bar, New Delhi, Delhi, India",
//       "Khushdil Kulfi & Milk Bar, New Delhi, Delhi, India",
//       "Khushdil Kulfi & Milk Bar, New Delhi, Delhi, India",
//       "Bara Hindu Rao, New Delhi, Delhi, India",
//       "Bara Hindu Rao, New Delhi, Delhi, India",
//       "Jhandewalan Temple, New Delhi, Delhi, India",
//       "Hotel Toronto, New Delhi, Delhi, India",
//       "Bikaner Sweets Corner, New Delhi, Delhi, India",
//       "Star Plaza Hotel, 5158, Main Bazar, Pahar Ganj, Behind R. K. Ashram Metro Station, New Delhi, Delhi, India",
//       "Northern Railway Central Hospital, Basant Lane, Connaught Place, New Delhi, Delhi, India",
//       "Northern Railway Central Hospital, Basant Lane, Connaught Place, New Delhi, Delhi, India",
//       "Veda Restaurant, H 27, New Delhi, Delhi, India",
//       "Khub Chand & Bros, New Delhi, Delhi, India",
//       "Connaught Place  कनॉट प्लेस, Connaught Place, New Delhi, Delhi, India"
//     ],
//     [
//       "Delhi Technological University Delhi College Of Engineering, Bawana Auchandi Rd, Rohini, New Delhi, Delhi, India",
//       "Shahbad Daulatpur, New Delhi, North West Delhi, Delhi, India",
//       "Guru Nanak Industrial Area, New Delhi, North West Delhi, Delhi, India",
//       "Guru Nanak Industrial Area, New Delhi, North West Delhi, Delhi, India",
//       "Rohini Sector 16, New Delhi, North West Delhi, Delhi, India",
//       "Rohini Sector 18, New Delhi, North West Delhi, Delhi, India",
//       "Vivekananda Institute of Professional Studies, AU Block, Pitampura, New Delhi, Delhi, India",
//       "Vivekananda Institute of Professional Studies, AU Block, Pitampura, New Delhi, Delhi, India",
//       "Vivekananda Institute of Professional Studies, AU Block, Pitampura, New Delhi, Delhi, India",
//       "Pizza Hut, G 19 & 20, Gr Flr, Fun City Mall, Prashant Vihar, New Delhi, Delhi, India",
//       "24 SEVEN, SN AB 13, Gr Flr, Azadpur Metro Station, Opp AD Mkt, New Delhi, Delhi, India",
//       "24 SEVEN, SN AB 13, Gr Flr, Azadpur Metro Station, Opp AD Mkt, New Delhi, Delhi, India",
//       "DT Cinemas, Shalimar Bagh, New Delhi, Delhi, India",
//       "All Heavens, B-97, Wazirpur, Ring Road, New Delhi, Delhi, India",
//       "The Mohans, Deep Market, New Delhi, Delhi, India",
//       "C7 Market Keshav Puram, New Delhi, Delhi, India",
//       "J Block Murga Market, J Block Market, Ashok Vihar Ph 1, New Delhi, Delhi, India",
//       "J Block Murga Market, J Block Market, Ashok Vihar Ph 1, New Delhi, Delhi, India",
//       "Big Bazaar, New Delhi, Delhi, India",
//       "Kanhaiya Nagar  कन्हैया नगर Metro Station, Tri nagar, New Delhi, Delhi, India",
//       "Big Bazaar, New Delhi, Delhi, India",
//       "Inderlok Metro Station, Inderlok Metro Station, New Delhi, Delhi, India",
//       "Dayabasti Railway Station, Daya basti, New Delhi, Delhi, India",
//       "Shastri Nagar  शास्त्री नगर Metro Station, New Delhi, Delhi, India",
//       "Subway, Near malka ganj chowk, New Delhi, Delhi, India",
//       "Subway, Near malka ganj chowk, New Delhi, Delhi, India",
//       "Subway, Near malka ganj chowk, New Delhi, Delhi, India",
//       "Changhezi, karolbagh, New Delhi, Delhi, India",
//       "Changhezi, karolbagh, New Delhi, Delhi, India",
//       "Jhandewalan Temple, New Delhi, Delhi, India",
//       "Jhandewalan Temple, New Delhi, Delhi, India",
//       "Jhandewalan Temple, New Delhi, Delhi, India",
//       "Jhandewalan Temple, New Delhi, Delhi, India",
//       "Bikaner Sweets Corner, New Delhi, Delhi, India",
//       "Star Plaza Hotel, 5158, Main Bazar, Pahar Ganj, Behind R. K. Ashram Metro Station, New Delhi, Delhi, India",
//       "Northern Railway Central Hospital, Basant Lane, Connaught Place, New Delhi, Delhi, India",
//       "Northern Railway Central Hospital, Basant Lane, Connaught Place, New Delhi, Delhi, India",
//       "Veda Restaurant, H 27, New Delhi, Delhi, India",
//       "Khub Chand & Bros, New Delhi, Delhi, India",
//       "Connaught Place  कनॉट प्लेस, Connaught Place, New Delhi, Delhi, India"
//     ]
//   ]
// }


// "routesWithStreetName": [
// 	//     [ "akbar road",
// 	//       "aruna asaf ali marg",
// 	//       "barakhamba road",
// 	//       "mathura road",
// 	//       "iit flyover",
// 	//       "Delhi Technological University Delhi College Of Engineering, Bawana Auchandi Rd, Rohini, New Delhi, Delhi, India",
// 	//       "Shahbad Daulatpur, New Delhi, North West Delhi, Delhi, India",
// 	//       "Guru Nanak Industrial Area, New Delhi, North West Delhi, Delhi, India",
// 	//       "Guru Nanak Industrial Area, New Delhi, North West Delhi, Delhi, India",
// 	//       "Rohini Sector 16, New Delhi, North West Delhi, Delhi, India",
// 	//       "Rohini Sector 18, New Delhi, North West Delhi, Delhi, India",
// 	//       "Vivekananda Institute of Professional Studies, AU Block, Pitampura, New Delhi, Delhi, India",
// 	//       "Vivekananda Institute of Professional Studies, AU Block, Pitampura, New Delhi, Delhi, India",
// 	//       "Vivekananda Institute of Professional Studies, AU Block, Pitampura, New Delhi, Delhi, India",
// 	//       "Pizza Hut, G 19 & 20, Gr Flr, Fun City Mall, Prashant Vihar, New Delhi, Delhi, India",
// 	//       "24 SEVEN, SN AB 13, Gr Flr, Azadpur Metro Station, Opp AD Mkt, New Delhi, Delhi, India",
// 	//       "24 SEVEN, SN AB 13, Gr Flr, Azadpur Metro Station, Opp AD Mkt, New Delhi, Delhi, India",
// 	//       "DT Cinemas, Shalimar Bagh, New Delhi, Delhi, India",
// 	//       "All Heavens, B-97, Wazirpur, Ring Road, New Delhi, Delhi, India",
// 	//       "The Mohans, Deep Market, New Delhi, Delhi, India",
// 	//       "Mall TVR, Opposite Invitation Restaurant, New Delhi, Delhi, India",
// 	//       "Cafe Coffee Day, Ashok Vihar, New Delhi, Delhi, India",
// 	//       "Horilal Pan Shop, Block B DDA Market Phase 3, New Delhi, Delhi, India",
// 	//       "Sardar, 16 Block J DDA Market Ashok Vihar Ph 1, New Delhi, Delhi, India",
// 	//       "Sardar, 16 Block J DDA Market Ashok Vihar Ph 1, New Delhi, Delhi, India",
// 	//       "Ashok Vihar Phase 3, New Delhi, North Delhi, Delhi, India",
// 	//       "Ashok Vihar Phase 3, New Delhi, North Delhi, Delhi, India",
// 	//       "Gulabi Bagh, New Delhi, North Delhi, Delhi, India",
// 	//       "Gulabi Bagh, New Delhi, North Delhi, Delhi, India",
// 	//       "Gulabi Bagh, New Delhi, North Delhi, Delhi, India",
// 	//       "Roshanara Club, Roshanara Gardens, New Delhi, Delhi, India",
// 	//       "Roshanara Club, Roshanara Gardens, New Delhi, Delhi, India",
// 	//       "Khushdil Kulfi & Milk Bar, New Delhi, Delhi, India",
// 	//       "Khushdil Kulfi & Milk Bar, New Delhi, Delhi, India",
// 	//       "Khushdil Kulfi & Milk Bar, New Delhi, Delhi, India",
// 	//       "Bara Hindu Rao, New Delhi, Delhi, India",
// 	//       "Bara Hindu Rao, New Delhi, Delhi, India",
// 	//       "Jhandewalan Temple, New Delhi, Delhi, India",
// 	//       "Hotel Toronto, New Delhi, Delhi, India",
// 	//       "Bikaner Sweets Corner, New Delhi, Delhi, India",
// 	//       "Star Plaza Hotel, 5158, Main Bazar, Pahar Ganj, Behind R. K. Ashram Metro Station, New Delhi, Delhi, India",
// 	//       "Northern Railway Central Hospital, Basant Lane, Connaught Place, New Delhi, Delhi, India",
// 	//       "Northern Railway Central Hospital, Basant Lane, Connaught Place, New Delhi, Delhi, India",
// 	//       "Veda Restaurant, H 27, New Delhi, Delhi, India",
// 	//       "Khub Chand & Bros, New Delhi, Delhi, India",
// 	//       "Connaught Place  कनॉट प्लेस, Connaught Place, New Delhi, Delhi, India"
// 	//     ],
// 	//     [
// 	//       "Delhi Technological University Delhi College Of Engineering, Bawana Auchandi Rd, Rohini, New Delhi, Delhi, India",
// 	//       "Shahbad Daulatpur, New Delhi, North West Delhi, Delhi, India",
// 	//       "Guru Nanak Industrial Area, New Delhi, North West Delhi, Delhi, India",
// 	//       "Guru Nanak Industrial Area, New Delhi, North West Delhi, Delhi, India",
// 	//       "Rohini Sector 16, New Delhi, North West Delhi, Delhi, India",
// 	//       "Rohini Sector 18, New Delhi, North West Delhi, Delhi, India",
// 	//       "Rohini Sector 19, New Delhi, North West Delhi, Delhi, India",
// 	//       "Badli, New Delhi, North West Delhi, Delhi, India",
// 	//       "Rohini Sector 19, New Delhi, North West Delhi, Delhi, India",
// 	//       "Passport Seva Kendra (PSK)  पासपोर्ट सेवा केन्द्र, Aggarwal Auto mall, New Delhi, Delhi, India",
// 	//       "Shalimar Bagh Paschimi, New Delhi, North West Delhi, Delhi, India",
// 	//       "Shalimar Bagh Paschimi, New Delhi, North West Delhi, Delhi, India",
// 	//       "Shalimar Bagh Paschimi, New Delhi, North West Delhi, Delhi, India",
// 	//       "Jahangirpuri Metro Station  जहांगीरपुरी, New Delhi, Delhi, India",
// 	//       "Jahangirpuri Metro Station  जहांगीरपुरी, New Delhi, Delhi, India",
// 	//       "Jahangirpuri Metro Station  जहांगीरपुरी, New Delhi, Delhi, India",
// 	//       "Jahangirpuri Metro Station  जहांगीरपुरी, New Delhi, Delhi, India",
// 	//       "Adarsh Nagar Metro Station, New Delhi, Delhi, India",
// 	//       "Speedway Surgical Company, 67/5 Block A, Industrial Area, New Delhi, Delhi, India",
// 	//       "24 SEVEN, F14/13, Nr Malikapur Village, New Delhi, Delhi, India",
// 	//       "Diet Clinic Gujranwala Town North Delhi, 224, Gujranwala Town, part 3, New Delhi, Delhi, India",
// 	//       "Grand Venizia, New Delhi, Delhi, India",
// 	//       "Kirpal Ashram, Sant Kirpal Singh Marg, New Delhi, Delhi, India",
// 	//       "Kirpal Ashram, Sant Kirpal Singh Marg, New Delhi, Delhi, India",
// 	//       "Spark Kamla Nagar, Central Round About, New Delhi, Delhi, India",
// 	//       "Ved Dhaba, Near Malkaganj Chowk, New Delhi, Delhi, India",
// 	//       "Manohar Bikaneri, New Delhi, Delhi, India",
// 	//       "Khushdil Kulfi & Milk Bar, New Delhi, Delhi, India",
// 	//       "Khushdil Kulfi & Milk Bar, New Delhi, Delhi, India",
// 	//       "Khushdil Kulfi & Milk Bar, New Delhi, Delhi, India",
// 	//       "Bara Hindu Rao, New Delhi, Delhi, India",
// 	//       "Bara Hindu Rao, New Delhi, Delhi, India",
// 	//       "Jhandewalan Temple, New Delhi, Delhi, India",
// 	//       "Hotel Toronto, New Delhi, Delhi, India",
// 	//       "Bikaner Sweets Corner, New Delhi, Delhi, India",
// 	//       "Star Plaza Hotel, 5158, Main Bazar, Pahar Ganj, Behind R. K. Ashram Metro Station, New Delhi, Delhi, India",
// 	//       "Northern Railway Central Hospital, Basant Lane, Connaught Place, New Delhi, Delhi, India",
// 	//       "Northern Railway Central Hospital, Basant Lane, Connaught Place, New Delhi, Delhi, India",
// 	//       "Veda Restaurant, H 27, New Delhi, Delhi, India",
// 	//       "Khub Chand & Bros, New Delhi, Delhi, India",
// 	//       "Connaught Place  कनॉट प्लेस, Connaught Place, New Delhi, Delhi, India"
// 	//     ],
// 	//     [
// 	//       "Delhi Technological University Delhi College Of Engineering, Bawana Auchandi Rd, Rohini, New Delhi, Delhi, India",
// 	//       "Shahbad Daulatpur, New Delhi, North West Delhi, Delhi, India",
// 	//       "Guru Nanak Industrial Area, New Delhi, North West Delhi, Delhi, India",
// 	//       "Guru Nanak Industrial Area, New Delhi, North West Delhi, Delhi, India",
// 	//       "Rohini Sector 16, New Delhi, North West Delhi, Delhi, India",
// 	//       "Rohini Sector 18, New Delhi, North West Delhi, Delhi, India",
// 	//       "Vivekananda Institute of Professional Studies, AU Block, Pitampura, New Delhi, Delhi, India",
// 	//       "Vivekananda Institute of Professional Studies, AU Block, Pitampura, New Delhi, Delhi, India",
// 	//       "Vivekananda Institute of Professional Studies, AU Block, Pitampura, New Delhi, Delhi, India",
// 	//       "Pizza Hut, G 19 & 20, Gr Flr, Fun City Mall, Prashant Vihar, New Delhi, Delhi, India",
// 	//       "24 SEVEN, SN AB 13, Gr Flr, Azadpur Metro Station, Opp AD Mkt, New Delhi, Delhi, India",
// 	//       "24 SEVEN, SN AB 13, Gr Flr, Azadpur Metro Station, Opp AD Mkt, New Delhi, Delhi, India",
// 	//       "DT Cinemas, Shalimar Bagh, New Delhi, Delhi, India",
// 	//       "All Heavens, B-97, Wazirpur, Ring Road, New Delhi, Delhi, India",
// 	//       "The Mohans, Deep Market, New Delhi, Delhi, India",
// 	//       "C7 Market Keshav Puram, New Delhi, Delhi, India",
// 	//       "J Block Murga Market, J Block Market, Ashok Vihar Ph 1, New Delhi, Delhi, India",
// 	//       "J Block Murga Market, J Block Market, Ashok Vihar Ph 1, New Delhi, Delhi, India",
// 	//       "Big Bazaar, New Delhi, Delhi, India",
// 	//       "Kanhaiya Nagar  कन्हैया नगर Metro Station, Tri nagar, New Delhi, Delhi, India",
// 	//       "Big Bazaar, New Delhi, Delhi, India",
// 	//       "Inderlok Metro Station, Inderlok Metro Station, New Delhi, Delhi, India",
// 	//       "Dayabasti Railway Station, Daya basti, New Delhi, Delhi, India",
// 	//       "Shastri Nagar  शास्त्री नगर Metro Station, New Delhi, Delhi, India",
// 	//       "Subway, Near malka ganj chowk, New Delhi, Delhi, India",
// 	//       "Subway, Near malka ganj chowk, New Delhi, Delhi, India",
// 	//       "Subway, Near malka ganj chowk, New Delhi, Delhi, India",
// 	//       "Changhezi, karolbagh, New Delhi, Delhi, India",
// 	//       "Changhezi, karolbagh, New Delhi, Delhi, India",
// 	//       "Jhandewalan Temple, New Delhi, Delhi, India",
// 	//       "Jhandewalan Temple, New Delhi, Delhi, India",
// 	//       "Jhandewalan Temple, New Delhi, Delhi, India",
// 	//       "Jhandewalan Temple, New Delhi, Delhi, India",
// 	//       "Bikaner Sweets Corner, New Delhi, Delhi, India",
// 	//       "Star Plaza Hotel, 5158, Main Bazar, Pahar Ganj, Behind R. K. Ashram Metro Station, New Delhi, Delhi, India",
// 	//       "Northern Railway Central Hospital, Basant Lane, Connaught Place, New Delhi, Delhi, India",
// 	//       "Northern Railway Central Hospital, Basant Lane, Connaught Place, New Delhi, Delhi, India",
// 	//       "Veda Restaurant, H 27, New Delhi, Delhi, India",
// 	//       "Khub Chand & Bros, New Delhi, Delhi, India",
// 	//       "Connaught Place  कनॉट प्लेस, Connaught Place, New Delhi, Delhi, India"
// 	//     ]
// 	//   ]