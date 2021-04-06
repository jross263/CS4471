import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { alert } from './alert.reducer';
import { services } from './services.reducer';

const rootReducer = combineReducers({
    authentication,
    registration,
    alert,
    services
});

export default rootReducer;