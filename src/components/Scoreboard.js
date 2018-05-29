import React from 'react'
import { connect } from 'react-redux';

class Scoreboard extends React.Component {

	render(){
		// console.log('scoreboard render', this.props)
		let scoreboard = []
		for(let name in this.props.scoreboard){
			scoreboard.push(<p key={name}>{name}: {this.props.scoreboard[name]}</p>)
		}
		
		return (
			<div className='scoreboard-container'>
			
			<div className='scoreboard'>
			<h5> SCOREBOARD </h5>
			{scoreboard}
			</div>
			</div>
			)
	}
}

function mapStateToProps(state){
	return {scoreboard: state.scoreboard}
}

export const ConnectedScoreboard = connect(mapStateToProps)(Scoreboard)