import React, { Component } from "react";
import MapGl, { Marker , NavigationControl} from "react-map-gl";
import axios from "axios";
import "../../App.css";

const style = {
	width: "30px",
	height: "30px"
};
<<<<<<< HEAD
// const token = process.env.REACT_APP_TOKEN;
const token = 'pk.eyJ1IjoiZGVlcHRpOTU2IiwiYSI6ImNrZjZ0ZGpjNDBoam8yeHFnMTI2dWE3eDgifQ.JEwmSczpEYR8bRhYFhLXVQ';
=======
const token = process.env.REACT_APP_TOKEN;
>>>>>>> e2ed37925d58c5710af3925266a5c5a3a7e2f41a

class Maps extends Component {
	state = {
		viewport: {
			width: "100vw",
			height: "100vh",
			latitude: 28.7041,
			longitude: 77.1025,
			zoom: 10
		},
		userLocation: {},
		streetNameUserLocation: null,
		ready: false,
		poi:null
	};
	setUserLocation = async () => {
		navigator.geolocation.getCurrentPosition( async(position) => {
			let setUserLocation = {
				lat: position.coords.latitude,
				long: position.coords.longitude
			};
			// let setUserLocation = {
			// 	lat: 28.632754499999997,
			// 	long: 77.21987
			// };
			
			let newViewport = {
				height: "100vh",
				width: "100vw",
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				zoom: 16
			};
			// let newViewport = {
			// 	height: "100vh",
			// 	width: "100vw",
			// 	latitude: setUserLocation.lat,
			// 	longitude: setUserLocation.long,
			// 	zoom: 12
			// };
			this.setState({
				viewport: newViewport,
				userLocation: setUserLocation,
				ready:true
			});
			// this.setState({
			// 	viewport: newViewport,
			// 	userLocation: setUserLocation,
			// 	ready:true
			// });
			const res = await features(this.state.userLocation.lat,this.state.userLocation.long);	
			//const res = await features(28.632754499999997,77.21987);	
			
			this.setState({streetNameUserLocation:res.data});
			//console.log(res.data.features[0].properties.text);
			
		});
		var arr=[];
		
		async function features(lat,long){
			//console.log(this.state.userLocation);
		const res = await axios.get(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${token}`
		);
		//this.setState({streetNameUserLocation:res.data});
		console.log("res data");
		console.log(res.data);
		//console.log(res.data.features[0].text);
		const data = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${res.data.features[0].text}.json?proximity=${long},${lat}&types=poi&access_token=${token}`)
		//const data = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/connaught%20place.json?types=poi&access_token=${token}`);
		console.log(data);
		//this.setState({poi:data.data.features})
		for(var i=0;i<data.data.features.length;i++)
		{
			arr.push([data.data.features[i].center,data.data.features[i].text]);
		}
		//return res.data.features[0].text;
		//this.setState({poi:arr});
			return res.data;
		}
		this.setState({poi:arr});
		// const res = await axios.get(
		// 	`https://api.mapbox.com/geocoding/v5/mapbox.places/${
		// 		this.state.userLocation.long
		// 	},${
		// 		this.state.userLocation.lat
		// 	}.json?access_token=pk.eyJ1IjoiZGVlcHRpOTU2IiwiYSI6ImNrMm5qaTNpYTAzNGUzY21iaGk4OXE0NmgifQ.U_MZSq_xnxBIZpT6rJS2Vg`
		// );
		//if(this.state.ready){
		// const data = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.streetNameUserLocation}.json?access_token=${token}`
		// );
		// console.log(data);
	};
	render() {
		return (
			<div className='container'>
				<br/>
				
			<div style={{ height: "90vh" }}>
				<MapGl
					{...this.state.viewport}
					onViewportChange={viewport => this.setState({ viewport })}
					mapboxApiAccessToken={token}
					mapStyle="mapbox://styles/mapbox/streets-v9"
					width="100%"
					height="90%">
					{Object.keys(this.state.userLocation).length !== 0 ? (
						<Marker
							latitude={this.state.userLocation.lat}
							longitude={this.state.userLocation.long}>
							<img
								src={require("./Location.png")}
								className="location-icon"
								style={style}
							/>
							
						</Marker>

					) : (
						<div></div>
					)}
					{
						this.state.poi!==null &&(
							this.state.poi.map(center=>(
								<Marker
							latitude={center[0][1]}
							longitude={center[0][0]}>
							<img
								src={require("./Location-06.png")}
								className="location-icon"
								style={style}
							/>
							<p>{center[1]}</p>
							</Marker>
							))
						)
					}
					<button className="btn btn-primary btn-loc" onClick={this.setUserLocation}>
					My Location
				</button>
				<div style={{ position: "absolute", right: 0 }}>
                    <NavigationControl />
                  </div>

				</MapGl>
			</div>
			</div>
		);
	}
}
export default Maps;
