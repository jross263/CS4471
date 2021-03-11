const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const serviceService = require('./service.service');

router.get('/', authorize(), getAll);
router.get('/active', authorize(), getAllActive);
router.get('/subscriptions', authorize(), getSubscriptions)
router.post('/:id/subscribe', authorize(), subscribe);
router.post('/:id/unsubscribe', authorize(), unsubscribe);
router.post('/', authorize(), createServiceSchema, create);
router.put('/:id', authorize(), updateSchema, update);

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

function createServiceSchema(req, res, next) {
    const schema = Joi.object({
        serviceName: Joi.string().required(),
        active: Joi.boolean().required()
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    serviceService.create(req.body)
        .then(() => res.json({ message: 'Service creation successful' }))
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

function updateSchema(req, res, next) {
    const schema = Joi.object({
        active: Joi.bool().empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    serviceService.update(req.params.id, req.body)
        .then(service => res.json(service))
        .catch(next);
}