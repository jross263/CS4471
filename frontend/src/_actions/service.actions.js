import { serviceConstants } from '../_constants';
import { serviceService } from '../_services';
import { alertActions } from './';

export const serviceActions = {
    getAllActiveAndSubscribed,
    getAll,
    subscribe,
    unsubscribe,
    shutdown,
    start,
    create
};

function getAllActiveAndSubscribed() {
    return dispatch => {
        dispatch(request())
        serviceService.getAllActive()
            .then(
            activeServices => {
                serviceService.getSubscribed()
                    .then(
                        subscribedServices => {
                            dispatch(success({active:activeServices,subscribed:subscribedServices}));
                    },
                        error => {
                            dispatch(failure(error.toString()));
                            dispatch(alertActions.error(error.toString()));
                    })
            },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
    };

    function request() { return { type: serviceConstants.GET_ACTIVE_SUBSCRIBED_REQUEST } }
    function success(services) { return { type: serviceConstants.GET_ACTIVE_SUBSCRIBED_SUCCESS, services } }
    function failure(error) { return { type: serviceConstants.GET_ACTIVE_SUBSCRIBED_FAILURE, error } }
}

function getAll(){
    return dispatch => {
        dispatch(request())
        serviceService.getAll()
            .then(
                services => {
                    dispatch(success(services));
            },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
    }

    function request() { return { type: serviceConstants.GET_ALL_REQUEST } }
    function success(services) { return { type: serviceConstants.GET_ALL_SUCCESS, services } }
    function failure(error) { return { type: serviceConstants.GET_ALL_FAILURE, error } }
}

function subscribe(id) {
    return dispatch => {
        dispatch(request())
        serviceService.subscribe(id)
            .then(
                () => {
                    dispatch(success());
                    dispatch(getAllActiveAndSubscribed())
                    dispatch(alertActions.success('Subscription successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
    };

    function request() { return { type: serviceConstants.SUBSCRIBE_REQUEST } }
    function success() { return { type: serviceConstants.SUBSCRIBE_SUCCESS } }
    function failure(error) { return { type: serviceConstants.SUBSCRIBE_FAILURE, error } }
}

function unsubscribe(id) {
    return dispatch => {
        dispatch(request())
        serviceService.unsubscribe(id)
            .then(
                () => {
                    dispatch(success());
                    dispatch(getAllActiveAndSubscribed())
                    dispatch(alertActions.success('Unsubscription successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
    };

    function request() { return { type: serviceConstants.UNSUBSCRIBE_REQUEST } }
    function success() { return { type: serviceConstants.UNSUBSCRIBE_SUCCESS } }
    function failure(error) { return { type: serviceConstants.UNSUBSCRIBE_FAILURE, error } }
}

function shutdown(id){
    return dispatch => {
        dispatch(request())
        serviceService.shutdown(id)
            .then(
                () => {
                    dispatch(success());
                    dispatch(getAll())
                    dispatch(alertActions.success('Shutdown successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
    };

    function request() { return { type: serviceConstants.SHUTDOWN_REQUEST } }
    function success() { return { type: serviceConstants.SHUTDOWN_SUCCESS } }
    function failure(error) { return { type: serviceConstants.SHUTDOWN_FAILURE, error } }
}

function start(id){
    return dispatch => {
        dispatch(request())
        serviceService.start(id)
            .then(
                () => {
                    dispatch(success());
                    dispatch(getAll())
                    dispatch(alertActions.success('Start successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
    };

    function request() { return { type: serviceConstants.START_REQUEST } }
    function success() { return { type: serviceConstants.START_SUCCESS } }
    function failure(error) { return { type: serviceConstants.START_FAILURE, error } }
}

function create(name, description, active){
    return dispatch => {
        dispatch(request())
        serviceService.create(name, description, active)
            .then(
                () => {
                    dispatch(success());
                    dispatch(alertActions.success('Service created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
    };

    function request() { return { type: serviceConstants.CREATE_REQUEST } }
    function success() { return { type: serviceConstants.CREATE_SUCCESS } }
    function failure(error) { return { type: serviceConstants.CREATE_FAILURE, error } }
}