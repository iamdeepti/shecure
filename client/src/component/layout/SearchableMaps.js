import React, { Component } from "react";
import MapGL, { NavigationControl} from "react-map-gl";
import { GeoJsonLayer } from "deck.gl";
import Geocoder from "./Geocoder";
import "./geocoder.css";
import axios from "axios";
import PolylineOverlay from "./PolylineOverlay";
import Feedback from "../pages/Feedback";
import { Button, Alert, Accordion, Card } from "react-bootstrap";
import "../../App.css";
import { Redirect } from "react-router-dom";
var token = null;
class SearchableMap extends Component {
  state = {
    viewport: {
      width: 400,
      height: 400,
      latitude: 28.7041,
      longitude: 77.1025,
      zoom: 10,
    },
    searchResultLayerSource: null,
    searchResultLayerDestination: null,
    sourceName: null,
    destinationName: null,
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
    hideMap: false,
    hideFeedback: true,
    selectedRoute: null,
    sampleFeedback: [72, 55, 44, 32],
    token_loaded: false,
    redirectTo: null
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
    token = await res.data;
    this.setState({ token_loaded: true });
  };
  mapRef = React.createRef();
  handleViewportChange = (viewport) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });
  };
  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange = (viewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides,
    });
  };

  handleOnResultSource = async (event) => {
    this.setState({
      searchResultLayerSource: new GeoJsonLayer({
        id: "search-result-source",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10,
      }),
      source: event.result.geometry.coordinates,
    });
    const element = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.source[0]},${this.state.source[1]}.json?access_token=${token}`
    );
    this.setState({ sourceName: element.data.features[0].place_name });
  };
  handleOnResultDestination = async (event) => {
    this.setState({
      searchResultLayerDestination: new GeoJsonLayer({
        id: "search-result-destination",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10,
      }),
      destination: event.result.geometry.coordinates,
    });
    const element = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.destination[0]},${this.state.destination[1]}.json?access_token=${token}`
    );
    this.setState({ destinationName: element.data.features[0].place_name });
  };
  getRoutes = async (e) => {
    // var token = await this.gettoken();
    e.preventDefault();
    this.setState({
      routesWithStreetName: null,
      safetyScores: [],
      latlongSafety: null,
      ready: false,
    });

    const res = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${this.state.source[0]},${this.state.source[1]};${this.state.destination[0]},${this.state.destination[1]}?steps=true&alternatives=true&geometries=geojson&access_token=${token}`
    );
    this.setState({ routes: res.data });
    var arr = [];
    for (var i = 0; i < this.state.routes.routes.length; i++) {
      var temp = [];
      for (var j = 0; j < this.state.routes.routes[i].legs[0].steps.length; j++)
        for (
          var k = 0;
          k <
          this.state.routes.routes[i].legs[0].steps[j].geometry.coordinates
            .length;
          k++
        )
          temp.push(
            this.state.routes.routes[i].legs[0].steps[j].geometry.coordinates[k]
          );
      arr.push(temp);
    }
    this.setState({
      //Set it to the best route you want to show, for the time being it's been set to show the first route
      //latlongArray: this.state.routes.routes[0].geometry.coordinates
      latlongArray: arr,
    });
    //do reverse geocoding
    //const getRoutesWithStreetNames =
    var getRoutesWithStreetNames = [];
    for (i = 0; i < this.state.routes.routes.length; i++) {
      arr = [];
      for (
        j = 0;
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
    let routesJson = JSON.stringify({
      routesWithStreetName: getRoutesWithStreetNames,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Allow-Access-Control-Origin": "*",
      },
    };
    const safetyScoresPredicted = await axios.post(
      "/api/predictSafety",
      routesJson,
      config
    );
    arr = [];
    this.setState({ safetyScores: safetyScoresPredicted.data });
    for (i = 0; i < this.state.routes.routes.length; i++) {
      arr.push([
        this.state.latlongArray[i],
        this.state.safetyScores[i],
        this.state.colors[i],
        this.state.routesWithStreetName[i],
        this.state.sampleFeedback[i],
        i,
        {
            "distance" : this.distanceHelper(this.state.routes.routes[i]["distance"]),
            "duration" : this.durationHelper(this.state.routes.routes[i]["duration"])
        }
      ]);
    }
    this.setState({ latlongSafety: arr });
    this.state.latlongSafety.sort(sortFunction);

    function sortFunction(a, b) {
      if (a[1] === b[1]) {
        return 0;
      } else {
        return a[1] > b[1] ? -1 : 1;
      }
    }
    for (i = 0; i < this.state.routes.routes.length; i++) {
      this.state.latlongSafety[i][2] = this.state.colors[i];
      this.state.latlongSafety[i][4] = this.state.sampleFeedback[i];
      this.state.latlongSafety[i][5] = i + 1;
    }
    this.setState({ ready: true });
  };

  distanceHelper = (distance) => {
    if(Number.isNaN(Number.parseFloat(distance))) {
        return "Not Available";
    }
    
    return `${Number.parseFloat(distance/1000).toFixed(1)} km`;
  }

  durationHelper = (duration) => {
    if(Number.isNaN(duration)) {
        return "Not Available";
    }

    const currentDurationInMin = Math.round(duration/60);

    return `${Math.floor(currentDurationInMin / 60)} hrs ${currentDurationInMin % 60} min`;
  }

  setSelectedRoute = (e) => {
    e.preventDefault();
    if(!this.props.user) {
      this.setState({
        selectedRoute: e.target.value,
        redirectTo: '/login'
      });
      return;
    }
    this.setState({
      selectedRoute: e.target.value,
      hideMap: true,
      hideFeedback: false,
    });
  };
  // sendMail = async () => {
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };
  //   const res = await axios.post(
  //     "api/mailer",
  //     { body: "some location" },
  //     config
  //   );
  // };
  setShow = (e) => {
    this.setState({ show: e });
  };
  render() {
    const {
      viewport
    } = this.state;
    if(this.state.redirectTo) {
      return ( <Redirect to={{pathname: this.state.redirectTo, state: {data: this.state.selectedRoute}}} /> )
    }
    return (
      <div>
        {this.state.token_loaded ? (
          <div className="container">
            {this.state.show === true && (
              <div>
                <Alert
                  variant="danger"
                  onClose={() => this.setShow(false)}
                  dismissible
                >
                  <Alert.Heading>
                    YOUR LOCATION WAS SENT TO YOUR TRUSTED CONTACTS
                  </Alert.Heading>
                  <p>You can call on these women helpline numbers too ...</p>
                </Alert>
              </div>
            )}
            {this.state.hideMap === false && (
              <div>
                <div className="row">
                  <div
                    className="col-lg-9 col-md-8 col-sm-12"
                    style={{ height: "90vh" }}
                  >
                    <MapGL
                      ref={this.mapRef}
                      {...viewport}
                      mapStyle="mapbox://styles/mapbox/streets-v9"
                      width="100%"
                      height="90%"
                      onViewportChange={this.handleViewportChange}
                      mapboxApiAccessToken={token}
                    >
                      <Geocoder
                        mapRef={this.mapRef}
                        onResult={this.handleOnResultSource}
                        onViewportChange={this.handleGeocoderViewportChange}
                        mapboxApiAccessToken={token}
                        position="top-left"
                        placeholder="Enter Source"
                        zoom={16}
                      />
                      <Geocoder
                        mapRef={this.mapRef}
                        onResult={this.handleOnResultDestination}
                        onViewportChange={this.handleGeocoderViewportChange}
                        mapboxApiAccessToken={token}
                        position="top-left"
                        placeholder="Enter destination"
                        zoom={12}
                      />
                      <span>
                        <Button
                          variant="primary"
                          className="btn-flex"
                          onClick={this.getRoutes}
                        >
                          Search Route
                        </Button>
                      </span>
                      
                      <div style={{ position: "absolute", right: 0 }}>
                        <NavigationControl />
                      </div>

                      {this.state.latlongSafety !== null &&
                        this.state.latlongSafety.map((latlong) => (
                          <div>
                            <PolylineOverlay
                              points={latlong[0]}
                              color={latlong[2]}
                            />
                          </div>
                        ))}
                      <div></div>
                    </MapGL>
                  </div>
                  {
                    <div class="col-lg-3 col-md-4 col-sm-12">
                      <p>
                        <span style={{ color: "red" }}>Source: </span>

                        {this.state.sourceName !== null
                          ? this.state.sourceName
                          : "Not Selected"}
                        <br />
                        <span style={{ color: "red" }}>Destination: </span>

                        {this.state.destinationName !== null
                          ? this.state.destinationName
                          : "Not Selected"}
                      </p>

                      <p> Route Info: </p>
                      <Accordion defaultActiveKey={1}>
                        {this.state.ready === true &&
                          this.state.latlongSafety !== null &&
                          this.state.latlongSafety.map((latlong) => (
                            <div>
                              <Card>
                                
                                <Accordion.Toggle
                                  as={Card.Header}
                                  eventKey={latlong[5]}
                                  style={{
                                    background: latlong[2],
                                    color: "white",
                                    textDecoration: "none",
                                  }}
                                >
                                  Route {latlong[5]}
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={latlong[5]}>
                                  <Card.Body style={{ color: latlong[2] }}>
                                    <h5 className="card-title">
                                      Safety Score :{latlong[1]}
                                    </h5>
                                    <p className="card-text ">
                                      {latlong[4]}% people found this route safe
                                    </p>
                                    <p className="card-text ">
                                      Travel Distance: {latlong[6]["distance"]}
                                    </p>
                                    <p className="card-text ">
                                      Travel Time: {latlong[6]["duration"]}
                                    </p>
                                    <button
                                      onClick={this.setSelectedRoute}
                                      value={latlong[3]}
                                      className="btn"
                                      style={{
                                        backgroundColor: latlong[2],
                                        color: "white",
                                      }}
                                    >
                                      Submit feedback
                                    </button>
                                  </Card.Body>
                                </Accordion.Collapse>
                              </Card>
                            </div>
                          ))}
                      </Accordion>
                    </div>
                  }
                </div>
              </div>
            )}
            {this.state.hideFeedback === false && (
              <Feedback data={this.state.selectedRoute} />
            )}
            <span>
              <Button
                variant="danger"
                className="btn-sos"
                onClick={() => this.setShow(true)}
              >
                SOS
              </Button>
            </span>
          </div>
        ) : (
          <p>loading...</p>
        )}
      </div>
    );
  }
}

export default SearchableMap;
