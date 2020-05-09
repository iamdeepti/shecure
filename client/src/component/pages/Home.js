import React, { Component } from 'react';
import {Image} from 'react-bootstrap';
import ShECURE from '../images/ShECURE.png';
import "../../App.css";
export class Home extends Component {
    render() {
        return (
            <div className='container'>
                
                <Image src={ShECURE} className='img-home'/>
            </div>
        )
    }
}

export default Home
