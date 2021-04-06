import { serviceConstants } from '../_constants';

export function services(state = {}, action) {
    switch (action.type) {
        case serviceConstants.GET_ACTIVE_SUBSCRIBED_REQUEST:
            return {
                loading: true
            };
        case serviceConstants.GET_ACTIVE_SUBSCRIBED_SUCCESS:
            return {
                active: action.services.active,
                subscribed: action.services.subscribed
            };
        case serviceConstants.GET_ACTIVE_SUBSCRIBED_FAILURE:
            return {
                error: action.error
            };
        case serviceConstants.GET_ALL_REQUEST:
            return {
                loading: true
            };
        case serviceConstants.GET_ALL_SUCCESS:
            return {
                all: action.services,
            };
        case serviceConstants.GET_ALL_FAILURE:
            return {
                error: action.error
            };
        case serviceConstants.GET_DATA_REQUEST:
            return {
                loading: true
            };
        case serviceConstants.GET_DATA_SUCCESS:
            return {
                currService: action.data,
            };
        case serviceConstants.GET_DATA_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}