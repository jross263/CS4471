import React, { useState } from "react";
import { useDispatch } from "react-redux";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { serviceActions } from "../_actions";


const AddPage = () => {
  const dispatch = useDispatch();

  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceActive, setServiceActive] = useState(false);

  return (
    <div className="col-lg-8 offset-lg-2">
      <Form onSubmit={(e)=>{
          e.preventDefault()
          dispatch(serviceActions.create(serviceName,serviceDesc, serviceActive))
      }}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Service Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Name" onChange={(e)=>setServiceName(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Service Description</Form.Label>
          <Form.Control type="text" placeholder="Enter Description" onChange={(e)=>setServiceDesc(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Enable Service?" onChange={(e)=>setServiceActive(!serviceActive)}/>
        </Form.Group>
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </div>
  );
};

export { AddPage };
