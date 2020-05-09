import React, { Component } from "react";
import NavBar from "./component/layout/NavBar";
import SearchSafeRoutes from "./component/pages/searchSafeRoutes";
import Map from "./component/layout/Maps";
import Feedback from "./component/pages/Feedback";
import Home from "./component/pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
export class App extends Component {
	render() {
		return (
			<Router>
				<div className="app">
					<NavBar />
					<div className="container">
						<Switch>
							<Route exact path="/" component={Home} />
							<Route
								exact
								path="/searchSafeRoutes"
								component={SearchSafeRoutes}
							/>
							<Route exact path="/Feedback" component={Feedback} />
							<Route exact path='/myLocation' component={Map} />
						</Switch>
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
