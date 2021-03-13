import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { serviceActions } from '../_actions';

import { ServiceCard } from '../_components'

const SubscriptionsPage = () => {

    const dispatch = useDispatch();
    const activeServices = useSelector(state => state.services.active);
    const subscribedServices = useSelector(state => state.services.subscribed);
    const loading = useSelector(state => state.services.loading);

    useEffect(() => {
        dispatch(serviceActions.getAllActiveAndSubscribed());
    }, []);

    const checkIfSubscribed = (serviceId) => {
        return subscribedServices?.some(item=> item.id === serviceId)
    }

    return(
        <div className="col-lg-8 offset-lg-2">
            {loading && <em>Loading services...</em>}
            {
               subscribedServices && subscribedServices.map((service,index)=>
                    <ServiceCard key={index} service={service} subscribed={checkIfSubscribed(service.id)}/>
                )
            }
            {
                subscribedServices?.length == 0 && <h1>Not subscribed to any services</h1>
            }
        </div>
    );
}

export { SubscriptionsPage };