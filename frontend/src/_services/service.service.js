import config from 'config';
import { authHeader } from '../_helpers';

export const serviceService = {
    getAllActive,
    getSubscribed,
    getAll,
    subscribe,
    unsubscribe,
    shutdown,
    start,
    create
};

function getAllActive() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/services/active`, requestOptions).then(handleResponse);
}

function getSubscribed() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/services/subscriptions`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/services`, requestOptions).then(handleResponse);
}

function subscribe(id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/services/${id}/subscribe`, requestOptions).then(handleResponse);
}

function unsubscribe(id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/services/${id}/unsubscribe`, requestOptions).then(handleResponse);
}

function shutdown(id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/services/${id}/shutdown`, requestOptions).then(handleResponse);
}

function start(id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/services/${id}/start`, requestOptions).then(handleResponse);
}

function create(name, description, active) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, active })
    };

    return fetch(`${config.apiUrl}/services`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}