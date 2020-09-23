import React, { Component } from "react";
import MapGl, { Marker, NavigationControl } from "react-map-gl";
import axios from "axios";
import "../../App.css";

const style = {
  width: "30px",
  height: "30px",
};
var token = null;
class Maps extends Component {
  state = {
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: 28.7041,
      longitude: 77.1025,
      zoom: 10,
    },
    userLocation: {},
    streetNameUserLocation: null,
    ready: false,
    poi: null,
    token_loaded: false,
  };
  componentDidMount() {
    this.fetchToken();
  }
  fetchToken = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Allow-Access-Control-Origin": "*",
      },
    };
    var res = await axios.post("api/sendtoken", {}, config);
    console.log("res" + res.data);
    token = await res.data;
    this.setState({ token_loaded: true });
  };
  setUserLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let setUserLocation = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      };
      let newViewport = {
        height: "100vh",
        width: "100vw",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 16,
      };
      this.setState({
        viewport: newViewport,
        userLocation: setUserLocation,
        ready: true,
      });
      const res = await features(
        this.state.userLocation.lat,
        this.state.userLocation.long
      );
      this.setState({ streetNameUserLocation: res.data });
    });
    var arr = [];

    async function features(lat, long) {
      const res = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${token}`
      );
      console.log("res data");
      console.log(res.data);
      const data = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${res.data.features[0].text}.json?proximity=${long},${lat}&types=poi&access_token=${token}`
      );
      console.log(data);
      for (var i = 0; i < data.data.features.length; i++) {
        arr.push([data.data.features[i].center, data.data.features[i].text]);
      }
      return res.data;
    }
    this.setState({ poi: arr });
  };
  render() {
    return (
      <div className="container">
        <br />

        {this.state.token_loaded ? (
          <div style={{ height: "90vh" }}>
            <MapGl
              {...this.state.viewport}
              onViewportChange={(viewport) => this.setState({ viewport })}
              mapboxApiAccessToken={token}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              width="100%"
              height="90%"
            >
              {Object.keys(this.state.userLocation).length !== 0 ? (
                <Marker
                  latitude={this.state.userLocation.lat}
                  longitude={this.state.userLocation.long}
                >
                  <img
                    src={require("../images/Location.png")}
                    className="location-icon"
					style={style}
					alt='your-location'
                  />
                </Marker>
              ) : (
                <div></div>
              )}
              {this.state.poi !== null &&
                this.state.poi.map((center) => (
                  <Marker latitude={center[0][1]} longitude={center[0][0]}>
                    <img
                      src={require("../images/Location-06.png")}
                      className="location-icon"
					  style={style}
					  alt='places of interest'
                    />
                    <p>{center[1]}</p>
                  </Marker>
                ))}
              <button
                className="btn btn-primary btn-loc"
                onClick={this.setUserLocation}
              >
                My Location
              </button>
              <div style={{ position: "absolute", right: 0 }}>
                <NavigationControl />
              </div>
            </MapGl>
          </div>
        ) : (
          <p>loading data...</p>
        )}
      </div>
    );
  }
}
export default Maps;
