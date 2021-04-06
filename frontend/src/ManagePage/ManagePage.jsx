import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { serviceActions } from '../_actions';

import { EditServiceCard } from '../_components'

const ManagePage = () => {

    const dispatch = useDispatch();
    const allServices = useSelector(state => state.services.all);
    const loading = useSelector(state => state.services.loading);

    useEffect(() => {
        dispatch(serviceActions.getAll());
    }, []);

    return(
        <div className="col-lg-8 offset-lg-2">
            {loading && <em>Loading services...</em>}
            {
               allServices && allServices.map((service,index)=>
                    <EditServiceCard key={index} service={service} />
                )
            }
            {
                allServices?.length == 0 && <h1>No services</h1>
            }
        </div>
    );
}

export { ManagePage };