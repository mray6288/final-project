import React from 'react'
import { connect } from 'react-redux'
import { login } from '../actions/actions'

class Login extends React.Component{

	state = {
		username: "",
		password: ""
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	handleSubmit = (e) => {
		e.preventDefault()
		this.props.login(this.state.username, this.state.password)
		.then(()=> this.props.history.push("/lobby"))
	}

	render(){
		return (
			<form onSubmit={this.handleSubmit}>
				Username: <input name="username" value={this.state.username} onChange={this.handleChange}/><br/>
				Password: <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/><br/>
				<input type='submit' name='Login'/>
			</form>
		)
	}

}


export default connect(null, { login })(Login)