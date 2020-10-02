import React, { Component } from "react";
import SearchableMaps from "../layout/SearchableMaps";

class searchSafeRoutes extends Component {
	

	render() {
		return (
			<div>
				<br/>
				<SearchableMaps user={this.props.user} />
			</div>
		);
	}
}

export default searchSafeRoutes;
