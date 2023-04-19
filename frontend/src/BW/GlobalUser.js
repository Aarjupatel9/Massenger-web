import React, { useState } from "react";
import ComDep from "./ComDep";
import UserContext from "./UserContext";

const GlobalUser = () => {
  const [user, setUser] = useState("aarju");
  const arr = ["aaarju", "mhk", "aman"];
  var counter = 0;
  
 
  return (
    <div>
      <UserContext.Provider value={user}>
        <h1>hello {user} ...</h1>
        <button onClick={() => {
          counter = counter + 1;
          console.log("counter ", counter);
          if (counter == 3) {
            counter = 0;
          }
          setUser(arr[counter]);
        }}>Change value</button>

        <ComDep />
      </UserContext.Provider>
    </div>
  );
};

export default GlobalUser;
