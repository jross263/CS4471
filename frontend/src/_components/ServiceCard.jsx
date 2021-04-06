import React from 'react';
import { useDispatch } from 'react-redux';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { serviceActions } from '../_actions'
import { useHistory } from "react-router-dom";


const ServiceCard = ({ service, subscribed }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    return(
        <Card style={{ width: '18rem' }}>
        <Card.Body>
            <Card.Title>{service.name.match(/[A-Z][a-z]+/g).join(" ")}</Card.Title>
            <Card.Text>
            {service.description}
            </Card.Text>
            <Button onClick={()=>{
                history.push(service.name.toLowerCase())
            }} variant="primary">View Service</Button>
            {subscribed && <Button onClick={()=>{
                dispatch(serviceActions.unsubscribe(service.id))
            }} variant="danger">Unsubscribe</Button>}
            {!subscribed && <Button onClick={()=>{
                dispatch(serviceActions.subscribe(service.id))
            }} variant="success">Subscribe</Button>}
        </Card.Body>
        </Card>
    )
}

export { ServiceCard };