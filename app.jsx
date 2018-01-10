//Component Function That return a (Single)Virtual DOM 
var PLAYERS = [
	{ name: "Nishant", score: 1, key: 1 },
	{ name: "Shekhar", score: 2, key: 2 },
	{ name: "Ravi", score: 3, key: 3 },
	{ name: "Nikesh", score: 4, key: 4 },
]
function Header(props) {
	return (
		<div className="header">
			<h1>{props.title}</h1>
		</div>
	);
}

function Player(props) {
	return (
		<div className="player">
			<div className="player-name">
				{props.name}
			</div>
			<div className="player-score">
				<Counter score={props.score} onChanges={props.onScoreChanges} />
			</div>
		</div>
	)
}

Player.propTypes ={ 
	onScoreChanges:React.PropTypes.func.isRequired
}

function Counter(props) {
	return (
		<div className="counter">
			<button className="counter-action decrement" onClick={function(){props.onChanges(-1)}}> - </button>
			<div className="counter-score">{props.score}</div>
			<button className="counter-action increment" onClick={function(){props.onChanges(1)}}> + </button>
		</div>
	);
}

Counter.propTypes ={ 
	score:React.PropTypes.number.isRequired,
	onChanges:React.PropTypes.func.isRequired
}

// function Application(props) {
// 	return (
// 		<div className="scoreboard">
// 			<Header title={props.title} />
// 			<div className="players">
// 				{props.players.map(
// 					function (player) { return <Player name={player.name} score={player.score} key={player.key} />; }
// 				)}
// 			</div>
// 		</div>
// 	);
// }

var Application = React.createClass({
	propTypes:{
		title: React.PropTypes.string
	},
	getDefaultProps:function(){
		return {title: "Default Title"}
	},
	getInitialState:function(){
		return {
			players: this.props.initialPlayers 
		}
	},
	onScoreChange:function(index,delta){
		console.log(index,delta)
		this.state.players[index].score += delta;
		this.setState(this.state)
	},
	render: function () {
		return (
			<div className="scoreboard">
				<Header title={this.props.title} />
				<div className="players">
					{this.state.players.map(
						function (player,index) { 
							return <Player 
								name={player.name} 
								score={player.score} 
								key={player.key} 
								onScoreChanges={function(delta){this.onScoreChange(index,delta)}.bind(this)}/>; 
						}.bind(this)
					)}
				</div>
			</div>
		)
	}
});
ReactDOM.render(<Application title="My Score Board" initialPlayers={PLAYERS} />, document.getElementById('container'));