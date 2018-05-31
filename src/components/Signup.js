import React from 'react'
import { connect } from 'react-redux'
import { signup } from '../actions/actions'
import {Link} from 'react-router-dom'

class Signup extends React.Component{

	state = {
		username: "",
		password: "",
		passwordConfirmation: ""
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	handleSubmit = (e) => {
		e.preventDefault()
		// console.log('signup props', this.props)
		if (this.state.password === this.state.passwordConfirmation){

		} else {
			alert("Password and Confirmation don't match")
		}
		this.props.signup(this.state.username, this.state.password)
		.then(()=> this.props.history.push("/lobby"))
	}

	render(){
		// console.log(this.props)
		return (
			<div className='register-form'>
			<h2>Signup</h2>
			<form onSubmit={this.handleSubmit}>
				Username: <input name="username" value={this.state.username} onChange={this.handleChange}/><br/>
				<br/>
				Password: <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/><br/>
				<br/>
				Confirm Password: <input type="password" name="passwordConfirmation" value={this.state.passwordConfirmation} onChange={this.handleChange}/><br/>
				<br/>
				<input type='submit' value='Register'/>
			</form>
			<br/>
			<Link to='/login' >Or Login Here</Link>
			</div>
		)
	}
}


export default connect(null, { signup })(Signup)