import React, { Component } from "react";
import NavBar from "./component/layout/NavBar";
import SearchSafeRoutes from "./component/pages/searchSafeRoutes";
import Map from "./component/layout/Maps";
import Feedback from "./component/pages/Feedback";
import Home from "./component/pages/Home";
import SignUp from "./component/pages/SignUp";
import LogIn from "./component/pages/LogIn";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
export class App extends Component {
	state = {
		user: null
	}

	componentDidMount() {
		axios.get('/api/auth/user').then(res => {
			this.setState({
				user: res.data.user
			})
		})
	}

	setUser = (user) => {
		this.setState({user: user})
	}

	render() {
		return (
			<Router>
				<div className="app">
					<NavBar user={this.state.user} setUser={this.setUser} />
					
						<Switch>
							<Route exact path="/" component={Home} />
							<Route
								exact
								path="/searchSafeRoutes"
								render={(props) => (
									<SearchSafeRoutes {...props} user={this.state.user} />
								)}
							/>
							<Route exact path="/Feedback" component={Feedback} />
							<Route exact path='/myLocation' component={Map} />
							<Route exact path='/signup' component={SignUp} />
							<Route 
								exact 
								path="/login" 
								render={(props) => (
									<LogIn {...props} setUser={this.setUser} />
								)}
							/>
						</Switch>
					
				</div>
			</Router>
		);
	}
}

export default App;
