import React from "react";
import {Navbar,Nav} from 'react-bootstrap';
export default function NavBar() {
	return (
		<Navbar bg="dark" expand="lg" variant='dark'>
			<Navbar.Brand href="/">ShECURE</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link href="/searchSafeRoutes">search safe routes</Nav.Link>
					<Nav.Link href='/myLocation'>My Location</Nav.Link>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
}
