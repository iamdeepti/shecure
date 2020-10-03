import React, { Component } from 'react';
import axios from 'axios';
export class Feedback extends Component {
	state = {
		lighting: null,
		ranking: null,
		remark: null,
		routesWithStreetNames:null,
		sentiment: null
	};
	setLight = (e)=>{
		e.preventDefault();
		this.setState({lighting:e.target.value});
	};
	setRemarks = (e)=>{
		e.preventDefault();
		this.setState({remark:e.target.value});
	};
	setRating = (e)=>{
		e.preventDefault();
    this.setState({ranking:e.target.value});
    this.setState({routesWithStreetNames:this.props.data});
	};
	addFeedback = async (e) => {
		e.preventDefault();
		const config = {
			headers: {
			  'Content-Type': 'application/json'
			}
		  };
		  var sentiment = await axios.post('api/sentiment',{"remarks":this.state.remark},config);
		  sentiment = sentiment.data;
		  this.setState({sentiment:sentiment});
		let feedback = JSON.stringify(this.state);
    await axios.post('/api/feedback', feedback,config);
		window.location.reload(true);
	}
	
  render() {
    return (
      <div className = 'container'>
        <form>
          <div class='input-field col s12'>
            <br></br>
            <br></br>
            <br></br>
            <h1 align='center'>
              <u>FEEDBACK FORM</u>
            </h1>
            <br></br>
            <h6 align='center'>
              Please help us improve by sharing your experience with us
            </h6>
            <br></br>
            <br></br>
            <p> How well lit the road was? </p>
            <input
              type='radio'
              name='light'
              value='low'
              onChange={this.setLight}
            />{' '}
            <span>Low</span>
            <br />
            <input
              type='radio'
              name='light'
              value='medium'
              onChange={this.setLight}
            />{' '}
            <span>Medium</span>
            <br />
            <input
              type='radio'
              name='light'
              value='high'
              onChange={this.setLight}
            />{' '}
            <span>High</span>
            <br />
            <br />
            <p> How safe did you feel? </p>
            <input
              type='radio'
              name='rate'
              value='1'
              onChange={this.setRating}
            />{' '}
            <span>1</span>
            <br />
            <input
              type='radio'
              name='rate'
              value='2'
              onChange={this.setRating}
            />{' '}
            <span>2</span>
            <br />
            <input
              type='radio'
              name='rate'
              value='3'
              onChange={this.setRating}
            />{' '}
            <span>3</span>
            <br />
            <input
              type='radio'
              name='rate'
              value='4'
              onChange={this.setRating}
            />{' '}
            <span>4</span>
            <br />
            <input
              type='radio'
              name='rate'
              value='5'
              onChange={this.setRating}
            />{' '}
            <span>5</span>
            <br />
            <br />
            <p>Enter Remarks please: </p>
            <textarea
              rows='5'
              cols='80'
              name='text'
              onChange={this.setRemarks}
            />
            <br />
            <br />
            <button
              type='submit'
              className='btn btn-sm btn-dark'
              onClick={this.addFeedback}
            >
              Submit form
            </button>
            
          </div>
        </form>
      </div>
    );
  }
}

export default Feedback;