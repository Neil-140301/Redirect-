// const ProgressBar = () => {
//   return (
//     <div>ProgressBar</div>
//   )
// }

// export default ProgressBar

import React from 'react';
import _ from 'lodash';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

class ChangingProgressbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentPercentageIndex: 0,
		};
	}

	componentDidMount() {
		setInterval(() => {
			this.setState({
				currentPercentageIndex:
					(this.state.currentPercentageIndex + 1) %
					this.props.percentages.length,
			});
		}, this.props.interval);
	}

	getStyles() {
		return this.props.stylesForPercentage
			? this.props.stylesForPercentage(this.getCurrentPercentage())
			: {};
	}

	getCurrentPercentage() {
		return this.props.percentages[this.state.currentPercentageIndex];
	}

	render() {
		const currentPercentage = this.getCurrentPercentage();

		return (
			<CircularProgressbar
				{...this.props}
				percentage={currentPercentage}
				text={this.props.textForPercentage(currentPercentage)}
				// styles={}
			/>
		);
	}
}

ChangingProgressbar.defaultProps = {
	interval: 1000,
};

function CountdownProgressbar(props) {
	const secondsToPercentages = _.range(props.numSeconds, -1, -1).map(
		(seconds) => (seconds / props.numSeconds) * 100
	);

	function percentageToSeconds(percentage) {
		return String((percentage / 100) * props.numSeconds);
	}

	return (
		<ChangingProgressbar
			percentages={secondsToPercentages}
			textForPercentage={percentageToSeconds}
			interval={1000}
			// stylesForPercentage={}
		/>
	);
}

export default CountdownProgressbar;
