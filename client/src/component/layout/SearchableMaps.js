import React, { Component } from "react";
import MapGL, { NavigationControl } from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import axios from "axios";
import PolylineOverlay from "./PolylineOverlay";
import Feedback from "../pages/Feedback";
import { Button,Alert } from "react-bootstrap";
import "../../App.css";
const token =
	"pk.eyJ1IjoiZGVlcHRpOTU2IiwiYSI6ImNrMm5qaTNpYTAzNGUzY21iaGk4OXE0NmgifQ.U_MZSq_xnxBIZpT6rJS2Vg";
//const token = process.env.MAPBOX_API;
class SearchableMap extends Component {
	state = {
		viewport: {
			latitude: 0,
			longitude: 0,
			zoom: 1
		},
		searchResultLayerSource: null,
		searchResultLayerDestination: null,
		source: [],
		destination: [],
		routes: null,
		latlongArray: null,
		routesWithStreetName: null,
		safetyScores: [],
		latlongSafety: null,
		ready: false,
		popup: false,
		show: false,
		//1-green 2-dark orange 3-orange 4-red
		colors: ["#008000", "#ffa500", "#ff8c00", "#ff0000"],
		hideMap:false,
		hideFeedback: true,
		selectedRoute:null,
		sampleFeedback: [72,55,44,32]
	};
	 
	mapRef = React.createRef();

	handleViewportChange = viewport => {
		this.setState({
			viewport: { ...this.state.viewport, ...viewport }
		});
	};
	// if you are happy with Geocoder default settings, you can just use handleViewportChange directly
	handleGeocoderViewportChange = viewport => {
		const geocoderDefaultOverrides = { transitionDuration: 1000 };

		return this.handleViewportChange({
			...viewport,
			...geocoderDefaultOverrides
		});
	};

	handleOnResultSource = event => {
		this.setState({
			searchResultLayerSource: new GeoJsonLayer({
				id: "search-result-source",
				data: event.result.geometry,
				getFillColor: [255, 0, 0, 128],
				getRadius: 1000,
				pointRadiusMinPixels: 10,
				pointRadiusMaxPixels: 10
			}),
			source: event.result.geometry.coordinates
		});
	};
	handleOnResultDestination = event => {
		this.setState({
			searchResultLayerDestination: new GeoJsonLayer({
				id: "search-result-destination",
				data: event.result.geometry,
				getFillColor: [255, 0, 0, 128],
				getRadius: 1000,
				pointRadiusMinPixels: 10,
				pointRadiusMaxPixels: 10
			}),
			destination: event.result.geometry.coordinates
		});
	};
	getRoutes = async e => {
		e.preventDefault();
		this.setState({
			routesWithStreetName: null,
			safetyScores: [],
			latlongSafety: null,
			ready: false
		});
		const res = await axios.get(
			`https://api.mapbox.com/directions/v5/mapbox/cycling/${this.state.source[0]},${this.state.source[1]};${this.state.destination[0]},${this.state.destination[1]}?steps=true&alternatives=true&geometries=geojson&access_token=${token}`
		);
		this.setState({ routes: res.data });
		var arr = [];
		for (var i = 0; i < this.state.routes.routes.length; i++) {
			var temp = [];
			temp.push(this.state.routes.routes[i].geometry.coordinates);
			arr.push(temp[0]);
		}
		this.setState({
			//Set it to the best route you want to show, for the time being it's been set to show the first route
			//latlongArray: this.state.routes.routes[0].geometry.coordinates
			latlongArray: arr
		});
		//do reverse geocoding
		//const getRoutesWithStreetNames =
		var getRoutesWithStreetNames = [];
		for (var i = 0; i < this.state.routes.routes.length; i++) {
			var arr = [];
			for (
				var j = 0;
				j < this.state.routes.routes[i].geometry.coordinates.length;
				j++
			) {
				const element = await axios.get(
					`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.routes.routes[i].geometry.coordinates[j][0]},${this.state.routes.routes[i].geometry.coordinates[j][1]}.json?access_token=${token}`
				);
				//console.log(element.data);
				arr.push(element.data.features[0].place_name);
			}
			getRoutesWithStreetNames.push(arr);
		}

		this.setState({ routesWithStreetName: getRoutesWithStreetNames });
		//console.log(getRoutesWithStreetNames);
		//let temp = JSON.stringify({getRoutesWithStreetNames});
		let routesJson = JSON.stringify({
			routesWithStreetName: getRoutesWithStreetNames
		});
		console.log(routesJson);
		const config = {
			headers: {
				"Content-Type": "application/json",
				"Allow-Access-Control-Origin":"*"
			}
		};
		const safetyScoresPredicted = await axios.post(
			"/api/predictSafety",
			routesJson,
			config
		);
		//console.log(safetyScores.data);
		arr = [];
		this.setState({ safetyScores: safetyScoresPredicted.data });
		for (var i = 0; i < this.state.routes.routes.length; i++) {
			//var temp = [];
			//temp.push(this.state.routes.routes[i].geometry.coordinates);
			arr.push([
				this.state.latlongArray[i],
				this.state.safetyScores[i],
				this.state.colors[i],
				this.state.routesWithStreetName[i],
				this.state.sampleFeedback[i]
			]);
		}
		this.setState({ latlongSafety: arr });
		//console.log(this.state.latlongArray);
		//console.log();
		this.state.latlongSafety.sort(sortFunction);

		function sortFunction(a, b) {
			if (a[1] === b[1]) {
				return 0;
			} else {
				return a[1] > b[1] ? -1 : 1;
			}
		}
		for (var i = 0; i < this.state.routes.routes.length; i++) {
			//var temp = [];
			//temp.push(this.state.routes.routes[i].geometry.coordinates);
			// arr.push([
			// 	this.state.latlongArray[i],
			// 	this.state.safetyScores[i],
			// 	this.state.colors[i],
			// 	this.state.routesWithStreetName[i]
			// ]);
			this.state.latlongSafety[i][2] = this.state.colors[i];
			this.state.latlongSafety[i][4] = this.state.sampleFeedback[i];
		}
		this.setState({ ready: true });
	};
	setSelectedRoute = (e)=>{
		e.preventDefault();
		this.setState({hideMap:true,hideFeedback:false,selectedRoute:e.target.value});
	}
	sendMail = async()=>{


		const config = {
			headers: {
			  'Content-Type': 'application/json'
			}
		  };
		const res = await axios.post('api/mailer', {'body':'some location'},config);
		console.log(res);
	}
	setShow = (e) =>{
		this.setState({show:e});
	}
// 	const [show, setShow] = useState(true);
//  func = ()=>{
//   if (show) {
//     return (
//       <Alert variant="danger" onClose={() => setShow(false)} dismissible>
//         <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
//         <p>
//           Change this and that and try again. Duis mollis, est non commodo
//           luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
//           Cras mattis consectetur purus sit amet fermentum.
//         </p>
//       </Alert>
//     );
//  }
//}
	render() {
		const {
			viewport,
			searchResultLayerSource,
			searchResultLayerDestination
		} = this.state;
		return (
			
			<div className='container'>
				{ this.state.show === true && (<div><Alert variant="danger" onClose={() => this.setShow(false)} dismissible>
        <Alert.Heading>YOUR LOCATION WAS SENT TO YOUR TRUSTED CONTACTS</Alert.Heading>
        <p>
         You can call on these women helpline numbers too ...
        </p>
      </Alert>
	  </div>)
					
				}
				{ this.state.hideMap===false &&
				(<div style={{ height: "100vh" }}>
					<MapGL
						ref={this.mapRef}
						{...viewport}
						mapStyle="mapbox://styles/mapbox/streets-v9"
						width="100%"
						height="90%"
						onViewportChange={this.handleViewportChange}
						mapboxApiAccessToken={token}>
						<Geocoder
							mapRef={this.mapRef}
							onResult={this.handleOnResultSource}
							onViewportChange={this.handleGeocoderViewportChange}
							mapboxApiAccessToken={token}
							position="top-left"
							placeholder="Enter Source"
						/>
						<Geocoder
							mapRef={this.mapRef}
							onResult={this.handleOnResultDestination}
							onViewportChange={this.handleGeocoderViewportChange}
							mapboxApiAccessToken={token}
							position="top-left"
							placeholder="Enter destination"
						/>
						{/* {this.state.latlongArray !== null && (
							//for(var i=0;i<Math.min(3,this.state.latlongArray.length);i++)
							<div>
								<PolylineOverlay
									points={this.state.latlongArray[0][0]}
									color={this.state.color}
								/>
								<PolylineOverlay
									points={this.state.latlongArray[1][0]}
									color="blue"
								/>
							</div>
						)} */}
						{this.state.latlongSafety !== null &&
							this.state.latlongSafety.map(latlong => (
								<div>
									<PolylineOverlay points={latlong[0]} color={latlong[2]} />
									{/* <div className="card">
									<p className="card-text ">{latlong[1]}</p>
									
								</div> */}
								</div>
							))}
						<div></div>
						<div style={{ position: "absolute", right: 0 }}>
							<NavigationControl />
						</div>
					</MapGL>
					<div className="row">
						{this.state.ready === true &&
							this.state.latlongSafety !== null &&
							this.state.latlongSafety.map(latlong => (
								<div className="col-sm-3">
									{/* <PolylineOverlay points={latlong[0]} color={latlong[2]}/> */}
									<div className="card" style={{ color: latlong[2] }}>
										<h5 className="card-title">Safety Score :{latlong[1]}</h5>
										<p className="card-text ">
											{latlong[4]}% people found this route safe
										</p>
										<button
											onClick={this.setSelectedRoute}
											value = {latlong[3]}
											className="btn"
											style={{ backgroundColor: latlong[2], color: "white" }}>
											End Route
										</button>
									</div>
								</div>
							))}
					</div>
					<span>
					<Button variant='primary' className='btn-flex' onClick={this.getRoutes}>
						Search Route
					</Button>
					</span>
					<DeckGL
						{...viewport}
						layers={[searchResultLayerSource, searchResultLayerDestination]}
					/>
				
				</div>)}
				{
					this.state.hideFeedback===false &&(<Feedback data={this.state.selectedRoute}/>)
				}
				<span>
				<Button variant='danger' className = 'btn-right' onClick={()=>this.setShow(true)}>SOS</Button>
				</span>
			</div>
		);
		
	}
}

export default SearchableMap;
