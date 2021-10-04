import React, {useState} from "react";
import { Button } from 'react-bootstrap';
import { useMsal } from '@azure/msal-react';
import { callMsGraph } from "../graph";
import { ProfileData } from "./ProfileData";
import { loginRequest } from "../authConfig";

function ProfileContent() {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    const [user, setUser] = useState({
        MSALData: null,
        userId: null
    })
    const name = accounts[0] && accounts[0].name;
    const tempId = accounts[0] && accounts[0].localAccountId;

    async function loadUser() {
        setUser({
            MSALData: accounts[0] && accounts[0],
            userId: tempId
        })
        console.log(tempId)
        console.log(user)
        const url = "/api/users/"+tempId;
        try {
          // Uses fetch to call server
          const response = await fetch(url);
          console.log(response)
          // Reads returned JSON, which contains one property called tasks
          const retrievedData = await response.json();
          // Retrieve tasks, which contains an array of all tasks in database
          console.log("retrieve user")
          console.log(retrievedData)
          
        
      } catch (error) {
          // If there is an error, display a generic message on the page
         console.log("something went wrong")
         console.log(error.message)
         
      }
    
    }

    function RequestProfileData() {
        const request = {
            ...loginRequest,
            account: accounts[0]
        };

        // Silently acquires an access token which is then attached to a request for Microsoft Graph data
        instance.acquireTokenSilent(request).then((response) => {
            callMsGraph(response.accessToken).then(response => setGraphData(response));
            
            
        }).catch((e) => {
            instance.acquireTokenPopup(request).then((response) => {
                callMsGraph(response.accessToken).then(response => setGraphData(response));
                
                
            });
        });
        loadUser();
    }

    return (
         <>
            <h5 className="card-title">Welcome {name}</h5>
            {graphData ? 
                <ProfileData graphData={graphData} />
                :
                <Button variant="secondary" onClick={RequestProfileData}>Check Account</Button>
            }
        </>
    );
};

export default ProfileContent;