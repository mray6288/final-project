import React from 'react'
import { connect } from 'react-redux'
import { login } from '../actions/actions'
import { Link } from 'react-router-dom'

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
			<div className='login forms'>
				<h2>Login</h2>
				<form onSubmit={this.handleSubmit}>
					Username: <input name="username" value={this.state.username} onChange={this.handleChange}/><br/>
					<br/>
					Password: <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/><br/>
					<br/>
					<input type='submit' value='Login'/>
				</form>
				<br/>
				<Link to='/signup' >Or Register Here</Link>
			</div>
		)
	}

}


export default connect(null, { login })(Login)