//Component Function That return a (Single)Virtual DOM 
var PLAYERS = [
	{ name: "Nishant", score: 1, key: 1 },
	{ name: "Shekhar", score: 2, key: 2 },
	{ name: "Ravi", score: 3, key: 3 },
	{ name: "Nikesh", score: 4, key: 4 },
]
var nextId=5;
function Header(props) {
	return (
		<div className="header">
			<Stats players={props.players}/>
			<h1>{props.title}</h1>
			<Stopwatch/>
		</div>
	);
}

function Player(props) {
	return (
		<div className="player">
			<div className="player-name">
				<a className="remove-player" onClick={props.onRemove}> X </a>
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

function Stats(props){
	var totalPlayers = props.players.length;
	var totalPoints = props.players.reduce(function(total,player){
		return total + player.score;
	},0) 
	return(
		<table className="stats">
			<tbody>
				<tr>
					<td>Players</td>
					<td>{totalPlayers}</td>
				</tr>
				<tr>
					<td>Total Points</td>
					<td>{totalPoints}</td>
				</tr>
			</tbody>
		</table>
	)
}

Stats.propTypes={
	players:React.PropTypes.array.isRequired,
}

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
		this.state.players[index].score += delta;
		this.setState(this.state)
	},
	onPlayerAdd:function(data){
		this.state.players.push({
			name:data,
			score:0,
			key:this.random()
		})
		console.log(this.state.players)
		this.setState(this.state)
	},
	random:function(){
		console.log(nextId)
		return (nextId++)
	},
	onRemovePlayer:function(index){
		this.state.players.splice(index,1)
		this.setState(this.state)
	},
	render: function () {
		return (
			<div className="scoreboard">
				<Header title={this.props.title} players={this.state.players}/>
				<div className="players">
					{this.state.players.map(
						function (player,index) { 
							return <Player
								onRemove={function(){this.onRemovePlayer(index)}.bind(this)} 
								name={player.name} 
								score={player.score} 
								key={player.key} 
								onScoreChanges={function(delta){this.onScoreChange(index,delta)}.bind(this)}/>; 
						}.bind(this)
					)}
				</div>
				<AddPlayerForm onAdd={this.onPlayerAdd}/>
			</div>
		)
	}
});

var AddPlayerForm = React.createClass({
	onSubmit:function(e){
		e.preventDefault();
		this.props.onAdd(this.state.name);
		this.setState({name:''})
	},
	getInitialState:function(){
		return {
			name:''
		}
	},
	onNameChange:function(e){
		this.setState({name:e.target.value})
	},
	render:function(){
		return (
			<div className="add-player-form">
				<form onSubmit={this.onSubmit}>
					<input type="text" value={this.state.name} onChange={this.onNameChange}/>
					<input type="submit" value="Add Player"/>
				</form>
			</div>
		)
	}
})

var Stopwatch = React.createClass({
	getInitialState:function(){
		return {
			running:false,
			elapsedTime:0,
			previousTime:0
		}
	},
	onStart:function(){
		this.setState({
			running:true,
			previousTime:Date.now()
		})
	},
	onStop:function(){
		this.setState({
			running:false
		})
	},
	onReset:function(){
		this.setState({
			elapsedTime:0
		})
	},
	onTick:function(){
		if(this.state.running){
			var now = Date.now();
			this.setState({
				previousTime:now,
				elapsedTime:this.state.elapsedTime + (now - this.state.previousTime)
			})
		}

	},
	componentDidMount:function(){
		this.handle = setInterval(this.onTick,100)
	},
	componentWillUnmount:function(){
		clearInterval(this.handle)
	},
	render:function(){
		var seconds = Math.floor(this.state.elapsedTime / 1000)
		return(
			<div className="stopwatch">
			<h2>Stopwatch</h2>
			<div className="stopwatch-time">{seconds}</div>
			{this.state.running ? <button onClick={this.onStop}>Stop</button> : <button onClick={this.onStart}>Start</button>}
			<button onClick={this.onReset}>Reset</button>
			</div>
		)
	}
})

ReactDOM.render(<Application title="My Score Board" initialPlayers={PLAYERS} />, document.getElementById('container'));