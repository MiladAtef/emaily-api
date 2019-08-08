import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
	renderFields = () => {
		return formFields.map(({ label, name }, i) => {
			return (
				<Field
					key={i}
					type="text"
					name={name}
					label={label}
					component={SurveyField}
				/>
			);
		});
	};
	render() {
		return (
			<div>
				<form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
					{this.renderFields()}
					<Link className="red btn-flat white-text" to="/surveys">
						cancel
					</Link>
					<button className="teal btn-flat right white-text" type="submit">
						next
						<i className="material-icons right">done</i>
					</button>
				</form>
			</div>
		);
	}
}

function validate(values) {
	const errors = {};

	formFields.forEach(({ name }) => {
		if (!values[name]) {
			errors[name] = 'You must provide a value';
		}
	});

	if (values.recipients) {
		errors.recipients = validateEmails(values.recipients);
	}

	return errors;
}

export default reduxForm({
	form: 'surveyForm',
	validate,
	destroyOnUnmount: false
})(SurveyForm);
