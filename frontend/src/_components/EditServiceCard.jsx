import React from 'react';
import { useDispatch } from 'react-redux';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { serviceActions } from '../_actions'


const EditServiceCard = ({ service }) => {
    const dispatch = useDispatch();
    return(
        <Card style={{ width: '18rem' }}>
        <Card.Body>
            <Card.Title>{service.name.match(/[A-Z][a-z]+/g).join(" ")}</Card.Title>
            <Card.Text>
            {service.description}
            </Card.Text>
            {service.active && <Button onClick={()=>{
                dispatch(serviceActions.shutdown(service.id))
            }} variant="danger">Turn Off</Button>}
            {!service.active && <Button onClick={()=>{
                dispatch(serviceActions.start(service.id))
            }} variant="success">Turn On</Button>}
        </Card.Body>
        </Card>
    )
}

export { EditServiceCard };