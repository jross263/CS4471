import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

import { MDBDataTable } from 'mdbreact';

import { serviceActions } from '../_actions';

const columns = [
    {
      label: 'Symbol',
      field: 'symbol',
      sort: 'asc',
      width: 150
    },
    {
      label: 'Name',
      field: 'name',
      sort: 'asc',
      width: 200
    },
    {
      label: 'Price',
      field: 'price',
      sort: 'asc',
      width: 100
    },
    {
      label: '% Change',
      field: 'changesPercentage',
      sort: 'asc',
      width: 150
    },
    {
        label: 'Day Low',
        field: 'dayLow',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Day High',
        field: 'dayHigh',
        sort: 'asc',
        width: 150
      }
  ]

function DailyMarketIndex() {
    const dispatch = useDispatch();
    const history = useHistory();
    const allActiveServices = useSelector(state => state.services.active);
    const serviceData = useSelector(state => state?.services?.currService?.json);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(serviceActions.getAllActiveAndSubscribed());
    }, []);
    
    useEffect(()=>{
        if(Array.isArray(allActiveServices)){
            const active = allActiveServices?.reduce((prev,cur)=> prev || (cur.name === "DailyMarketIndex"),false);
            console.log(active,allActiveServices)
            if(!active){
                history.push("/")
            }else{
                setLoading(false);
                const service = allActiveServices.filter(ele=>ele.name === "DailyMarketIndex")[0]
                dispatch(serviceActions.getData(service?.id));
            }
        }

    },[allActiveServices])
    return (
        <div className="col-lg-8 offset-lg-2">
            <h1>Daily market index</h1>
            <MDBDataTable
                    striped
                    bordered
                    small
                    data={{ columns,rows:serviceData}}
                    />
        </div>
    );
}

export { DailyMarketIndex };