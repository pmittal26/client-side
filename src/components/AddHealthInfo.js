import React, { useState, useEffect } from 'react';
import { gql, useQuery } from "@apollo/client";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Form, Button, Table } from 'react-bootstrap';
import patient from './images/patientRecord.jpg';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { useAuthUserToken, useAuthUserType } from "../components/config/auth";
import Spinner from 'react-bootstrap/Spinner';

const ADD_HEALTH_INFO = gql`
mutation addInfo( $patientId:String!,
$date:String!, $pulseRate:Int!, 
$bloodPressure:Int!, $weight:Int!,  
$temperature: Int!, $respiratoryRate:Int!)
{
    addInfo( patientId: $patientId
        date: $date        
        pulseRate: $pulseRate
        bloodPressure: $bloodPressure
        weight:$weight
        temperature:$temperature
        respiratoryRate: $respiratoryRate) {
            patientId            
            date
            pulseRate
            bloodPressure
            weight
            temperature            
            respiratoryRate        
        }
    }
`;

const AddHealthInfo = () => {
  let navigate = useNavigate();

  let { patientId } = useParams();

  const [authUserToken] = useAuthUserToken();
  const [authType] = useAuthUserType();
  const [content, setContent] = useState("");

  const [addInfo, { data, loading, error }] = useMutation(ADD_HEALTH_INFO);
  const [info, setInfo] = React.useState({
    date: '',
    pulseRate: null,
    bloodPressure: null,
    weight: null,
    temperature: null,
    respiratoryRate: null
  });
  const [showLoading, setShowLoading] = useState(false);

  //if (loading) return 'Submitting...';
  //if (error) return `Submission error! ${error.message}`;

  const saveInfo = async (e) => {
    setShowLoading(true);
    e.preventDefault();
    try {
      const { data } = await addInfo({
        variables: {
          patientId: patientId,
          date: info.date,
          pulseRate: info.pulseRate,
          bloodPressure: info.bloodPressure,
          weight: info.weight,
          temperature: info.temperature,
          respiratoryRate: info.respiratoryRate
        }
      });
      //
      setInfo({ ...info, [e.target.name]: '' })
      navigate('/healthInfo/' + patientId)
    }
    catch (error) {
      setShowLoading(false);
      console.error('Adding health info error:', error);
    }
  };

  const onChange = (e) => {
    e.persist();
    const value = e.target.name === 'temperature' || e.target.name === 'bloodPressure' || e.target.name === 'weight' || e.target.name === 'pulseRate' || e.target.name === 'respiratoryRate'
      ? parseInt(e.target.value)
      : e.target.value;
    setInfo({ ...info, [e.target.name]: value });
  }

  useEffect(() => {
    if (isNurse()) {
      setContent(patientId);
    }
    else {
      setContent(sessionStorage.getItem("user_id"));
    }
  }, [authUserToken, authType]);

  const isNurse = () => {
    return authUserToken && authType === 'nurse';
  }

  return (
    <div className="info-background" style={{background:"#7FFFC1 "}}>
      <div className="App">
        {showLoading &&
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        }
        <Container>
          <h2>Daily Health Info</h2>
          <p>Enter your daily vital signs during the first week after releasing from the hospital.</p>
          <Form onSubmit={saveInfo}>
            {isNurse() ?
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="6">Patient Id:</Form.Label>
                <Col sm="6">
                  <Form.Control
                    className="mb-3"
                    id="patientId"
                    name="patientId"
                    type="text"
                    defaultValue={patientId}
                    placeholder='Enter patient id'
                    onChange={onChange} />
                </Col>
              </Form.Group>
              :
              <div></div>
            }
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="6">Date:</Form.Label>
              <Col sm="6">
                <Form.Control
                  className="mb-3"
                  id="date"
                  name="date"
                  type="date"
                  required
                  defaultValue={info.date}
                  placeholder='Enter date'
                  onChange={onChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="6">Weight (kg):</Form.Label>
              <Col sm="6">
                <Form.Control
                  className="mb-3"
                  id="weight"
                  name="weight"
                  type="number"
                  required
                  isInvalid={info.weight !== null && info.weight <= 0}
                  defaultValue={info.weight}
                  placeholder='Enter weight'
                  onChange={onChange} />
                <Form.Control.Feedback type="invalid">
                  {"Weight must be greater than 0"}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="6">Temperature (°C):</Form.Label>
              <Col sm="6">
                <Form.Control
                  className="mb-3"
                  id="temperature"
                  type="number"
                  required
                  isInvalid={info.temperature !== null && info.temperature <= 0}
                  name="temperature"
                  defaultValue={info.temperature}
                  placeholder='Enter temperature'
                  onChange={onChange} />
                <Form.Control.Feedback type="invalid">
                  {"Temperature must be greater than 0"}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="6">Blood Pressure (mm Hg):</Form.Label>
              <Col sm="6">
                <Form.Control
                  className="mb-3"
                  id="bloodPressure"
                  name="bloodPressure"
                  type="number"
                  required
                  isInvalid={info.bloodPressure !== null && info.bloodPressure <= 0}
                  defaultValue={info.bloodPressure}
                  placeholder='Enter blood pressure'
                  onChange={onChange} />
                <Form.Control.Feedback type="invalid">
                  {"Blood pressure must be greater than 0"}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="6">Pulse Rate (beats per minute):</Form.Label>
              <Col sm="6">
                <Form.Control
                  className="mb-3"
                  id="pulseRate"
                  name="pulseRate"
                  type="number"
                  required
                  isInvalid={info.pulseRate !== null && info.pulseRate <= 0}
                  defaultValue={info.pulseRate}
                  placeholder='Enter pulse rate'
                  onChange={onChange} />
                <Form.Control.Feedback type="invalid">
                  {"Pulse rate must be greater than 0"}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="6">Respiratory Rate (breaths per minute):</Form.Label>
              <Col sm="6">
                <Form.Control
                  className="mb-3"
                  id="respiratoryRate"
                  name="respiratoryRate"
                  type="number"
                  required
                  isInvalid={info.respiratoryRate !== null && info.respiratoryRate <= 0}
                  defaultValue={info.respiratoryRate}
                  placeholder='Enter respiratory rate'
                  onChange={onChange} />
                <Form.Control.Feedback type="invalid">
                  {"Respiratory rate must be greater than 0"}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            {loading ? <p style={{ color: 'blue' }}>Submitting</p> : <div></div>}
            {error ? <p style={{ color: 'red' }}>{error.message}</p> : <div></div>}

            <div className="d-flex justify-content-center App">
              <Button
                variant="success"
                className="btn btn-success mx-auto"
                type="submit">
                &#xF090; SAVE
              </Button>
            </div>

          </Form>
        </Container>
      </div>
    </div>
  );
}

export default AddHealthInfo
