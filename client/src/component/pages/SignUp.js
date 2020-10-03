import React, { Component } from 'react';
import axios from 'axios';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'

export class SignUp extends Component {
    state = {
        email: '',
        password: '',
        password2: '',
        redirectTo: null,
        error: '',
        emailValid: false,
        passwordValid: false
    }

    handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
        })

        if(event.target.name === 'email') {
           if(/.{1,}@[^.]{1,}/.test(event.target.value))
                this.setState({emailValid: true})
            else
                this.setState({emailValid: false}) 
        } else if(event.target.name === 'password') {
            if(/^(?=.*[A-Za-z])(?=.*\d).{10,}$/.test(event.target.value))
                 this.setState({passwordValid: true})
             else
                 this.setState({passwordValid: false}) 
         }
    }

    signUp = (email, password) => {
		axios.post('/api/auth/signup', {
			email: email, 
			password: password
		})
		.then(res => {
            if(res.status === 200)
                this.setState({redirectTo: '/login'})
        })
        .catch(err => {
            if(err.response.data.name === "UserExistsError")
                this.setState({error: 'This email address has already been registered'});
            else
                this.setState({error: 'An error ocurred. Please try again.'});
        })
    }
    
    handleSubmit = (event) => {
        event.preventDefault()
        if(this.state.password !== this.state.password2) 
            return this.setState({error: 'Passwords do not match'});
        this.signUp(this.state.email, this.state.password);
	}

    render() {
        if(this.state.redirectTo) {
            return <Redirect to={{pathname: this.state.redirectTo}}/>
        } else {
            return (
                <div className="col-md-6 offset-md-3 mt-5">
                    <Card
                    bg="light"
                    text="dark"
                    className="border-0 shadow-sm">
                        <Card.Body>
                            {this.state.error ? <Alert variant="danger" className="text-center">{this.state.error}</Alert> : <span></span>}
                            <Card.Title className="text-center">Create An Account</Card.Title>
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
                                    {this.state.emailValid || this.state.email.length===0 ? <span></span> : <Form.Text className="text-danger">Please enter a valid email address</Form.Text>}
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
                                    {this.state.passwordValid || this.state.password.length===0 ? <span></span> : <Form.Text className="text-danger">Your password must be at least 10 characters long and must contain a number</Form.Text>}
                                </Form.Group>

                                <Form.Group controlId="password2">
                                    <Form.Label>Re-enter Password</Form.Label>
                                    <Form.Control 
                                    type="password" 
                                    placeholder="Confirm password"
                                    name="password2"
                                    value={this.state.password2}
                                    onChange={this.handleChange}
                                    required />
                                </Form.Group>

                                <Button variant="dark" onClick={this.handleSubmit}>Sign Up</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            )
        }
    }
}

export default SignUp;