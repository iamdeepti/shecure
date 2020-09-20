import React, { Component } from "react";
import { Image } from "react-bootstrap";
import shecure from "../images/shecure.png";
import "../../App.css";
export class Home extends Component {
  render() {
    return (
      <div className="container">
        <Image src={shecure} className="img-home" />
        <h3>ABOUT</h3>
        <p>
          Shecure is a web application that leverages machine learning Algorithms to predict
          safe routes for women to travel. 
          The application provides two functionalities as of now:
          <ol>
              <li>Search safe routes: Routes are assigned a safety score based on some parameters</li>
              <li>My location: Shows nearby public places</li>
          </ol>
        </p>
      </div>
    );
  }
}

export default Home;
