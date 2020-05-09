import React, { Component } from 'react';
import {Image} from 'react-bootstrap';
import shecure from '../images/shecure.png';
import "../../App.css";
export class Home extends Component {
    render() {
        return (
            <div className='container'>
                
                <Image src={shecure} className='img-home'/>
            </div>
        )
    }
}

export default Home
