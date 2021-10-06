import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Container, Table, Row, Col, Card, Form } from "react-bootstrap";

function JobList(props) {
  const [jobArray, setJobArray] = useState(null);
  const [jobSearch, setJobSearch] = useState(null);
  console.log(props);
  console.log(props.jobList);
  console.log(props.userList);
  console.log(jobArray);

  const handleSearchChange = (e) => {
    console.log("firing search change");
    e.preventDefault();
    console.log(e.target.value.toString());
    setJobSearch(e.target.value.toString());
  };

  // const filterJobList = (searchTerm) = {

  // }

  function displayUserName(userId) {
    const userDisplayNameIndex = props.userList.user.find(
      (user) => user._id === userId
    );

    console.log(userDisplayNameIndex);

    if (userDisplayNameIndex) {
      return userDisplayNameIndex.userData.displayName;
    } else {
      return null;
    }
  }

  function onDragEnd(result) {
    console.log(result);
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (destination.droppableId !== "AssetBox") {
      console.log("adding");
      const droppableSplit = destination.droppableId.split(":");
      console.log(droppableSplit[2]);
      console.log(jobArray);
      const tempArray = Array.from(jobArray[droppableSplit[2]].users);
      console.log(tempArray);
      // check if this id is already in the array for this job
      // if it is then we stop the assignment
      const checkDuplicate = tempArray.includes(draggableId);
      console.log("check dupe:" + checkDuplicate);
      if (!checkDuplicate) {
        tempArray.splice(destination.index, 0, draggableId);
        const tempJobArray = [...jobArray];
        console.log(tempJobArray);
        tempJobArray[droppableSplit[2]].users = tempArray;
        // if user coming from another job delete from that job
        if (source.droppableId !== "AssetBox") {
          tempArray.splice(source.index, 1);
        }
        console.log(tempJobArray);
        setJobArray(() => tempJobArray);
        // call update function to update db that user has been allocated
      } else {
        console.log("duplicate found no action taken");
      }
    }
    // remove from job array when placed back into the box
    if (destination.droppableId === "AssetBox") {
      console.log("removing");
      const droppableSplit = source.droppableId.split(":");
      console.log(droppableSplit[2]);
      console.log(jobArray);
      const tempArray = Array.from(jobArray[droppableSplit[2]].users);
      console.log(tempArray);
      tempArray.splice(source.index, 1);
      const tempJobArray = [...jobArray];
      console.log(tempJobArray);
      tempJobArray[droppableSplit[2]].users = tempArray;
      console.log(tempJobArray);
      setJobArray(() => tempJobArray);
      // call update function to update db with removed user
    }
  }

  useEffect(() => {
    console.log("job search changed");
    console.log(jobSearch);
  }, [jobSearch]);

  useEffect(() => {
    setJobArray(props.jobList.jobs);
    console.log("use effect ran");
  }, [props.jobList.jobs]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          <h6>Users to Allocate:</h6>
          <Droppable droppableId="AssetBox">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <Container
                  style={{
                    minWidth: "10rem",
                    maxWidth: "10rem",
                  }}>
                  {[
                    props.userList.user.map((userItem, i) => (
                      <div>
                        <Draggable
                          key={userItem._id}
                          draggableId={userItem._id}
                          index={i}>
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}>
                              <Card
                                id={i}
                                style={{
                                  width: "7rem",
                                }}>
                                <Card.Text>
                                  {userItem.userData.displayName}
                                </Card.Text>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      </div>
                    )),
                  ]}
                  {provided.placeholder}
                </Container>
              </div>
            )}
          </Droppable>
        </Container>
        <br />
        <Container>
          <Form.Control
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
          />
        </Container>
        <br />
        <Container>
          <Row>
            <Col>
              {jobArray ? (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>ID#</th>
                      <th>Users</th>
                      <th>Assets</th>
                      <th>Job Number</th>
                      <th>Job Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobArray.map((jobItem, i) => (
                      <tr
                        style={{
                          minHeight: "80px",
                        }}
                        id={i}>
                        <td>{jobItem._id}</td>
                        <Droppable
                          droppableId={"user:" + jobItem._id + ":" + i}>
                          {(provided) => (
                            <td
                              ref={provided.innerRef}
                              {...provided.droppableProps}>
                              <Container
                                style={{
                                  minWidth: "10rem",
                                  maxWidth: "10rem",
                                }}>
                                {[
                                  jobItem.users.map((userItem, i) => (
                                    <div>
                                      <Draggable
                                        key={jobItem._id + ":" + userItem}
                                        draggableId={
                                          jobItem._id + ":" + userItem
                                        }
                                        index={i}>
                                        {(provided) => (
                                          <div
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}>
                                            <Card
                                              id={i}
                                              style={{
                                                width: "7rem",
                                              }}>
                                              <Card.Text>
                                                {displayUserName(userItem)}
                                              </Card.Text>
                                            </Card>
                                          </div>
                                        )}
                                      </Draggable>
                                    </div>
                                  )),
                                ]}
                                {provided.placeholder}
                              </Container>
                            </td>
                          )}
                        </Droppable>
                        <td>Asset Placeholder</td>
                        <td>Job #: {jobItem.jobNumber}</td>
                        <td>
                          {jobItem.status ? <p>Active</p> : <p>Archived</p>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : null}
            </Col>
          </Row>
        </Container>
      </DragDropContext>
    </>
  );
}

export default JobList;
