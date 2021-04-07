import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { serviceActions } from '../_actions';
import { MDBDataTable } from 'mdbreact'

const columns = [
    {
        label: 'Date',
        field: 'date',
        sort: 'des',
        width: 150
    },
    {
        label: 'Exchange',
        field: 'exchange',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Name',
        field: 'name',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Number of Shares',
        field: 'numberOfShares',
        sort: 'asc',
        width: 150
    },
    {
        label: 'Price (USD)',
        field: 'price',
        sort: 'asc',
        width: 100
    },
    {
        label: 'Status',
        field: 'status',
        sort: 'asc',
        width: 100
    },
    {
        label: 'Symbol',
        field: 'symbol',
        sort: 'asc',
        width: 200
    },
    {
        label: 'Total Shares Value',
        field: 'totalSharesValue',
        sort: 'asc',
        width: 150
    }
]

function IpoCalendar() {
    const dispatch = useDispatch();
    const history = useHistory();
    const allActiveServices = useSelector(state => state.services.active);
    const serviceData = useSelector(state => state?.services?.currService?.json);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(serviceActions.getAllActiveAndSubscribed());
    }, []);

    useEffect(() => {
        if (Array.isArray(allActiveServices)) {
            const active = allActiveServices?.reduce((prev, cur) => prev || (cur.name === "IpoCalendar"), false);
            console.log(active, allActiveServices)
            if (!active) {
                history.push("/")
            } else {
                setLoading(false);
                const service = allActiveServices.filter(ele => ele.name === "IpoCalendar")[0]
                dispatch(serviceActions.getData(service?.id));
            }
        }
    }, [allActiveServices])

    return (
        <div className="col-lg">
            {
                !loading &&
                <>
                    <h1>IPO Calendar</h1>
                    <MDBDataTable
                        striped
                        bordered
                        small
                        data={{ columns, rows: serviceData }}
                    />
                </>
            }
        </div>
    );
}

export { IpoCalendar };