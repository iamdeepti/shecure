import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Feedback from './Feedback';

export class LogIn extends Component {
    state = {
        email: '',
        password: '',
        hideFeedback: true,
        error: null,
        data: null
    }

    componentDidMount() {
        if(this.props.location.state)
            this.setState({data: this.props.location.state.data});
    }

    handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
        })
    }

    logIn = (email, password) => {
		axios.post('/api/auth/login', {
			email: email, 
			password: password
		})
		.then(res => {
			if(res.status === 200) {
                this.props.setUser(res.data.user)
                if(this.state.data) 
                    this.setState({hideFeedback: false})
                else {
                    this.props.history.goBack()
                }
			}
        })
        .catch(err => {
           this.setState({error: 'Username or password is incorrect'})
        })
	}
    handleSubmit = (event) => {
		event.preventDefault();
        this.logIn(this.state.email, this.state.password);
	}

    render() {
        if(!this.state.hideFeedback) {
                return (<Feedback data={this.state.data} />)
        } else {
            return (
                <div className="col-md-6 offset-md-3 mt-5">
                    <Card
                    bg="light"
                    text="dark"
                    className="border-0 shadow-sm">
                        <Card.Body>
                            {this.state.error ? <Alert variant="danger" className="text-center">{this.state.error}</Alert> : <span></span>}
                            <Card.Title className="text-center">Log In</Card.Title>
                            <Form>
                                <Form.Group controlId="email">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control 
                                     type="email"
                                     placeholder="Enter email"
                                     name="email"
                                     value={this.state.email}
                                     onChange={this.handleChange}
                                     required />
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                     type="password" 
                                     placeholder="Enter a password"
                                     name="password"
                                     value={this.state.password}
                                     onChange={this.handleChange}
                                     required />
                                </Form.Group>

                                <Button variant="dark" onClick={this.handleSubmit}>Login</Button>
                            </Form>
                            <br />
                            <Card.Link href="/signup"><Card.Text className="text-center text-secondary">Don't have an account? Create one now</Card.Text></Card.Link>
                        </Card.Body>
                    </Card>
                </div>
            )
        }
    }
}

export default withRouter(LogIn);