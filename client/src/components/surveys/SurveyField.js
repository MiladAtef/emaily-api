import React from 'react';

// we use here nested destructuring
// we are destructuring the (input,label,meta) from the props
// and also destructuring (error,touched) from meta
const SurveyField = ({ input, label, meta: { error, touched } }) => {
	return (
		<div>
			<label>{label}</label>
			<input {...input} style={{ marginBottom: '5px' }} />
			{touched && error && (
				<div className="red-text" style={{ marginBottom: '20px' }}>
					{error}
				</div>
			)}
		</div>
	);
};

export default SurveyField;
