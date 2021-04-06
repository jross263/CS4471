const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const serviceService = require('./service.service');

router.get('/', authorize(), getAll);
router.get('/active', authorize(), getAllActive);
router.get('/subscriptions', authorize(), getSubscriptions)
router.get('/:id', authorize(), getData)
router.post('/:id/subscribe', authorize(), subscribe);
router.post('/:id/unsubscribe', authorize(), unsubscribe);
router.post('/:id/shutdown', authorize(), shutdown);
router.post('/:id/start', authorize(), start);


module.exports = router

function getAll(req, res, next) {
    serviceService.getAll()
        .then(services => res.json(services))
        .catch(next);
}

function getAllActive(req, res, next) {
    serviceService.getAllActive()
        .then(services => res.json(services))
        .catch(next);
}

function getSubscriptions(req, res, next) {
    serviceService.getSubscriptions(req.user.id)
        .then(services => res.json(services))
        .catch(next);
}

function getData(req, res, next) {
    serviceService.getData(req.params.id)
        .then(data => res.json(data))
        .catch(next);
    
}

function subscribe(req, res, next) {
    serviceService.subscribe(req.params.id, req.user.id)
        .then(() => res.json({ message: 'Subscription successful' }))
        .catch(next);
}

function unsubscribe(req, res, next) {
    serviceService.unsubscribe(req.params.id, req.user.id)
        .then(() => res.json({ message: 'Unsubscription successful' }))
        .catch(next);
}

function shutdown(req, res, next) {
    serviceService.shutdown(req.params.id)
        .then(() => res.json({ message: 'Service shutdown' }))
        .catch(next);
}

function start(req, res, next){
    serviceService.start(req.params.id)
        .then(() => res.json({ message: 'Service started' }))
        .catch(next);
}