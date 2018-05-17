import React from 'react'
import { connect } from 'react-redux'
import { signup } from '../actions/actions'

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
		console.log(this.state)
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
			<form onSubmit={this.handleSubmit}>
				Username: <input name="username" value={this.state.username} onChange={this.handleChange}/><br/>
				Password: <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/><br/>
				Confirm Password: <input type="password" name="passwordConfirmation" value={this.state.passwordConfirmation} onChange={this.handleChange}/><br/>
				<input type='submit' name='Signup'/>
			</form>
		)
	}

}


export default connect(null, { signup })(Signup)