import React, { Component } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import PropTypes from 'prop-types';

// Styles
import Styles from './styles';

// set to fit
const scalesPageToFit = Platform.OS === 'android';

export default class Dots extends Component {
	static get propTypes() {
		return {
			length: PropTypes.number.isRequired,
			active: PropTypes.number.isRequired,

			width: PropTypes.number,
			paddingVertical: PropTypes.number,
			paddingHorizontal: PropTypes.number,

			// Dots
			passiveDotWidth: PropTypes.number,
			activeDotWidth: PropTypes.number,
			passiveColor: PropTypes.string,
			activeColor: PropTypes.string,

			// active Border
			activeBorder: PropTypes.bool,
			activeBorderColor: PropTypes.string,
			activeBorderWidth: PropTypes.number
		};
	}

	static defaultProps = {
		// ScrollView
		width: 300,
		paddingVertical: 10,
		paddingHorizontal: 10,

		// Dots
		passiveDotWidth: 10,
		activeDotWidth: 15,
		passiveColor: '#CCCCCC',
		activeColor: '#016bd8',

		// Borders
		activeBorder: false,
		activeBorderWidth: 3,
		activeBorderColor: '#FFF'
	};

	componentWillReceiveProps({ active }) {
		const oldActiveIndex = this.props.active;

		if (oldActiveIndex != active) {
			this.scrollTo(active);
		}
	}

	scrollTo(index) {
		const { width, activeDotWidth } = this.props;
		const get = this[`dots_${index}`];

		if (get) {
			const x = get.x - (width / 2 - activeDotWidth);

			return this.refs._scrollView.scrollTo({ x });
		}
	}

	isActive(index) {
		return this.props.active == index;
	}

	dotStyle(isActive) {
		const {
			activeDotWidth,
			passiveDotWidth,
			activeColor,
			passiveColor,
			activeBorder,
			activeBorderWidth,
			activeBorderColor
		} = this.props;
		const width = isActive ? activeDotWidth : passiveDotWidth;

		let style = {
			width,
			height: width,
			backgroundColor: isActive ? activeColor : passiveColor,
			borderRadius: width,
			marginHorizontal: 2,
			marginTop: isActive ? -width / 6 : 0
		};

		// active Border Styles.
		if (activeBorder && isActive) {
			style.borderWidth = activeBorderWidth;
			style.borderColor = activeBorderColor;
		}

		return style;
	}

	render() {
		const { length, width, paddingVertical, paddingHorizontal } = this.props;
		const list = [ ...Array(length).keys() ];

		return (
			<View style={Styles.container}>
				<ScrollView
					ref="_scrollView"
					style={{ width }}
					contentContainerStyle={{ paddingVertical, paddingHorizontal }}
					scalesPageToFit={scalesPageToFit}
					bounces={false}
					horizontal={true}
					scrollEnabled={false}
				>
					{list.map((i) => {
						return (
							<View
								key={i}
								style={this.dotStyle(this.isActive(i))}
								onLayout={({ nativeEvent: { layout: { x, y } } }) => {
									this[`dots_${i}`] = { x, y };
								}}
							/>
						);
					})}
				</ScrollView>
			</View>
		);
	}
}
