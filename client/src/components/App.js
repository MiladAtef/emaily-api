import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions';
import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import SurveyNew from './surveys/SurveyNew';

class App extends Component {
	componentDidMount() {
		// when the app loads up we fire that action
		// to specify wether the user is logged in or not
		this.props.fetchUser();
	}

	render() {
		return (
			<div className="container">
				<Router>
					<React.Fragment>
						<Header />
						<Route exact path="/" component={Landing} />
						<Route exact path="/surveys" component={Dashboard} />
						<Route exact path="/surveys/new" component={SurveyNew} />
					</React.Fragment>
				</Router>
			</div>
		);
	}
}

export default connect(
	null,
	actions
)(App);
