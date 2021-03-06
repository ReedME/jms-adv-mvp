/* eslint-disable react-hooks/exhaustive-deps */
// Render list of jobs
import React, { useState, useEffect } from "react";
import { Spinner, Container, Form, Row, Col, Button } from "react-bootstrap";
import JobList from "../components/JobList";

function Jobs() {
  const [jobs, setJobs] = useState(null);
  const [users, setUsers] = useState(null);
  const [jobInput, setJobInput] = useState({
    users: [],
    assets: [],
    client: {
      clientName: "Client Placeholder",
      clientId: "ClientId Placeholder",
    },
    jobNumber: "",
    status: true,
  });

  async function loadUser() {
    try {
      // Uses fetch to call server
      const response = await fetch("/api/users/all");

      const retrievedData = await response.json();

      setUsers(retrievedData);
    } catch (error) {
      // If there is an error, display a generic message on the page
      console.log("something went wrong");
      console.log(error.message);
    }
  }
  async function loadJob() {
    try {
      // Uses fetch to call server
      const response = await fetch("/api/jobs/all");

      const retrievedData = await response.json();

      setJobs(retrievedData);
    } catch (error) {
      // If there is an error, display a generic message on the page
      console.log("something went wrong");
      console.log(error.message);
    }
  }
  async function postJob() {
    const response = await fetch(
      "/api/jobs", // API location
      {
        method: "POST", // POST to create new item
        body: JSON.stringify(jobInput), // Add task to body
        headers: {
          "Content-Type": "application/json", // Set return type to JSON
        },
      }
    );
    console.log("Response: ");
    console.log(response);
  }

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    e.preventDefault();

    if (fieldName === "status") {
      // we want boolean for this
      setJobInput((prevJobInput) => ({
        ...prevJobInput,
        [fieldName]: fieldValue,
      }));
    } else {
      // we want strings for this
      setJobInput((prevJobInput) => ({
        ...prevJobInput,
        [fieldName]: fieldValue.toString(),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ... submit to API or something
    // Call server
    postJob().then(loadJob());
    // reload the job list
  };

  /* async function updateJob(input, _id) {
    console.log("made it into update function");
    console.log(input);
    console.log(_id);
    const requestBody = {
      status: input,
    };
    const url = "/api/jobs/" + _id;
    console.log("update URL" + url);
    const response = await fetch(
      url, // API location
      {
        method: "PUT", // PUT to update item
        body: JSON.stringify(requestBody), // Add task to body
        headers: {
          "Content-Type": "application/json", // Set return type to JSON
        },
      }
    );
    console.log("PUT Response: ");
    console.log(response);
  }
  */

  useEffect(() => {
    loadJob();
    loadUser();
    const interval = setInterval(() => {
      loadJob();
      loadUser();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const shouldRenderList = users && jobs;

  return (
    <>
      <Container>
        <h5 className="card-title">Jobs</h5>
        <h6> Create Job: </h6>
        <Form>
          <Row>
            <Col>
              <Form.Control
                onChange={handleChange}
                name="jobNumber"
                placeholder="Job Number #"
              />
            </Col>
            <Col>
              <Form.Select onChange={handleChange} name="status">
                <option value={true}>Active</option>
                <option value={false}>Archived</option>
              </Form.Select>
            </Col>
            <Col>
              <Button onClick={handleSubmit}>Submit Job</Button>
            </Col>
          </Row>
        </Form>
        <br />
        <h6> Job List: </h6>
        <br />
        {shouldRenderList ? (
          <JobList jobList={jobs} userList={users} loadCallback={loadJob} />
        ) : (
          <center>
            <Spinner variant="primary" animation="grow" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <h2>Loading...</h2>
          </center>
        )}
      </Container>
    </>
  );
}

export default Jobs;
