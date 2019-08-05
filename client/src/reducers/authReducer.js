import { FETCH_USER } from '../actions/types';

export default function(state = null, action) {
	switch (action.type) {
		case FETCH_USER:
			return action.payload || false;
		default:
			return state;
	}
}

// the initial state is null (if the axios request is pending)
// and if the user is logged in we will return the user info (action.payload)
// and if the user is not logged in (action.payload===''), so we will
//just return false
//long story short, we return one from these three (null, User model, false)
