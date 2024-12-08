import React, { useState, useEffect } from "react";
import ShowFriends from "./showFriendsCss";
import UserDetails from "./UserDetails";
import "./index.css";
const FriendCard = ({
  friend,
  onAddFriend,
  onDeleteFriend,
  onShowMutualFriends,
  onShowFriends,
  onShowDetails,
  selectedUser,
  currButtonSelected,
}) => {
  const isActive = selectedUser === friend._id;
  /*
{currButtonSelected === "userDetailsButton" &&
                      userDetailObj && (
                        <UserDetails userDetailObj={userDetailObj} />
                      )}
                    {currButtonSelected === "showFriendsButton" && arrayObj && (
                      <ShowFriends friends={arrayObj} />
                    )}
                    {currButtonSelected === "showMutualFriendsButton" &&
  */
  return (
    <div className="friend-card">
      <div className="friend-card-text">
        <h3>{friend.name}</h3>
      </div>
      <div className="friend-card-buttons">
        <button
          className={`friend-card-buttons-id-showButton ${
            isActive && currButtonSelected === "showFriendsButton"
              ? "active"
              : ""
          }`}
          onClick={() => onShowFriends(friend._id)}
        >
          Show Friends
        </button>
        <button
          className={`friend-card-buttons-id ${
            isActive && currButtonSelected === "showMutualFriendsButton"
              ? "active"
              : ""
          }`}
          onClick={() => onShowMutualFriends(friend._id)}
        >
          Show Mutual Friends
        </button>
        <button
          className={`friend-card-buttons-id ${
            isActive && currButtonSelected === "userDetailsButton"
              ? "active"
              : ""
          }`}
          onClick={() => onShowDetails(friend._id)}
        >
          User Details
        </button>
        <button
          className="friend-card-buttons-id"
          onClick={() => onAddFriend(friend._id)}
        >
          Add Friend
        </button>
        <button
          className="friend-card-buttons-id"
          onClick={() => onDeleteFriend(friend._id)}
        >
          Delete Friend
        </button>
      </div>
    </div>
  );
};
const App = () => {
  const [MutualObj, setMutualObj] = useState([]);
  const [arrayObj, setArrayObj] = useState([]); // Store friends/mutual friends
  const [userDetailObj, setUserDetailObj] = useState(null); // Store user details
  const [friends, setFriends] = useState([]); // Store all users
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user
  const [currButtonSelected, setCurrButtonSelected] = useState(""); // Store currently selected button action
  //const [loadForFriend, setLoadForFriend] = useState("false");
  // Fetch friends from the backend
  //const [isActive, setIsActive] = useState(false);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const graphqlQuery = {
        query: `
        query{
          showAllDocument{
          _id
          name
          friends
          }
        }
      `,
      };
      const response = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphqlQuery),
      });
      const result = await response.json();

      if (result.data && result.data.showAllDocument) {
        setFriends(result.data.showAllDocument);
      } else {
        console.error("No data returned from GraphQL query");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };
  // Handle adding a new user (at the top)
  const handleAddUser = async () => {
    const name = prompt("Enter user name:");
    const friends = prompt("Can enter friends ID's to add seperated by commas");

    if (name) {
      try {
        const graphqlQuery = {
          query: `
          mutation{
            addUser(userInput: {name:"${name}",friends:"${friends}"}){
            _id
            name
            friends
            }
          }
        `,
        };
        const response = await fetch("http://localhost:8080/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(graphqlQuery),
        });
        const result = await response.json();

        //console.log("result.data._id", result.data._id);
        //above gives undefined, we have to access like this only..
        console.log(
          "result.data.addUser._id returning userSchema",
          result.data.addUser._id
        );
        alert("User added!");
        fetchFriends(); // Reload friends list after adding
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  // Handle deleting a user (at the top)
  const handleDeleteUser = async () => {
    const userId = prompt("Enter user ID to delete:");
    if (userId) {
      try {
        const graphqlQuery = {
          query: `
          mutation{
            deleteUser(curr_user_id:"${userId}")
          }
        `,
        };
        const response = await fetch("http://localhost:8080/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(graphqlQuery),
        });
        const result = await response.json();
        //return string true or false
        if (!result.data) {
          const err = new Error(
            "error will fetchinge dtaa, data empty types kuch Delete User"
          );
          throw err;
        }
        console.log(result.data.deleteUser);
        //we got null because, error retuned??
        if (result.data.deleteUser === "true") {
          alert("User deleted!");
          console.log("User delete successfuly");
        } else {
          if (result.data.deleteUser === "true") {
            console.log("false returned while deleing");
          }
          console.log("user not deleted wrong id");
        }
        // alert("User deleted!");
        fetchFriends(); // Reload friends list after deleting
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };
  const handleShowFriends = async (currUserId) => {
    try {
      const graphqlQuery = {
        query: `
        mutation{
          showFriends(curr_user_id:"${currUserId}"){
          _id
          name
          friends
          }
        }
      `,
      };
      const response = await fetch(`http://localhost:8080/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphqlQuery),
      });
      const result = await response.json();
      const obj = result.data.showFriends;
      if (obj && obj.length > 0) {
        setArrayObj(obj); // Ensure arrayObj is set only if data is valid
        setCurrButtonSelected("showFriendsButton");
        setSelectedUser(currUserId);
      } else {
        console.log("No friends found.");
        setArrayObj([]); // Set an empty array to prevent undefined issues
      }

      setSelectedUser(currUserId);
    } catch (error) {
      console.error("Error showing friends:", error);
    }
  };

  const handleShowMutualFriends = async (currUserId) => {
    try {
      const friendId = prompt(
        "Enter friend user ID to find Mutual Friends Between:"
      );
      const graphqlQuery = {
        query: `
        mutation{
          mutualFriends(curr_user_id:"${currUserId}",friend_user_id:"${friendId}"){
          _id
          name
          friends
          }
        }
      `,
      };
      const response = await fetch(`http://localhost:8080/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphqlQuery),
      });
      const result = await response.json();
      const obj = result.data.mutualFriends;
      if (!obj) {
        console.log(
          "result is not defined,no mutual friends, undefined h, errror in ID of friend jisse nikalna h",
          obj
        );
        const error = new Error("no mutual friends");
        throw error;
      }
      console.log("mutual friends are", obj);
      setMutualObj(obj); // Set the array of mutual friends
      setCurrButtonSelected("showMutualFriendsButton");
      setSelectedUser(currUserId);
    } catch (error) {
      console.error("Error showing mutual friends:", error);
    }
  };
  const handleAddFriend = async (currUserId) => {
    try {
      const friendId = prompt("Enter friend user ID to Add:");
      //we get friend Id as as argument to this
      //string return hoga and string inside string,
      //double string??
      const graphqlQuery = {
        query: `
        mutation{
          addFriend(curr_user_id:"${currUserId}",friend_user_id:"${friendId}"){
          _id
          name
          friends
          }
        }
      `,
      };
      const response = await fetch(`http://localhost:8080/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });
      const result = await response.json();
      //check if result has error or what..

      //how do frontend user will know if there was any error, woh toh backend k server m dikha rha h
      //alert("Friend added!");
      setCurrButtonSelected("showAddFriendButton");
      fetchFriends(); // Reload friends list after adding
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };
  const handleDeleteFriend = async (currUserId) => {
    //we also need, currUserId
    //we are getting all curr jo user show ho rha uski id
    //to deleteFriend, add Friend, etc
    const friendId = prompt("Enter friend user ID to delete:");
    try {
      const graphqlQuery = {
        query: `
        mutation{
          deleteFriend(curr_user_id:"${currUserId}",friend_user_id:"${friendId}")
        }
      `,
      };
      const deletedornot = await fetch(`http://localhost:8080/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      });
      if (deletedornot) {
        //alert("Friend deleted!");
      }

      setCurrButtonSelected("showDeleteFriendButton");
      fetchFriends(); // Reload friends list after deleting
    } catch (error) {
      console.error("Error deleting friend:", error);
    }
  };

  const handleShowDetails = async (currUserId) => {
    try {
      const graphqlQuery = {
        query: `
        query{
          userDetail(curr_user_id:"${currUserId}"){
          _id
          name
          friends
          }
        }
      `,
      };
      const response = await fetch(`http://localhost:8080/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphqlQuery),
      });
      const result = await response.json();
      //console.log("value fetched result.data", result.data);
      console.log("value fetch result.data.userDetail", result.data.userDetail);
      const userObj = result.data.userDetail;
      setUserDetailObj(userObj); // Set the user details
      setCurrButtonSelected("userDetailsButton");
      setSelectedUser(currUserId);
    } catch (error) {
      console.error("Error showing user details:", error);
    }
  };
  const noFunction = async () => {};
  useEffect(() => {
    fetchFriends();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div id="main-body">
      <nav className="navbar">
        <div className="navbar-left">
          <span className="project-name">Search-Mutual-Friends</span>
        </div>
        <div className="navbar-right">
          <button onClick={noFunction}>Login</button>
          <button onClick={noFunction}>LogOut</button>
        </div>
      </nav>
      <header id="head">
        <button onClick={handleAddUser}>Add User</button>
        <button onClick={handleDeleteUser}>Delete User</button>
      </header>
      <h1 className="all-users">All Users!!</h1>
      <div className="friends-list">
        {friends.length === 0 ? (
          <p className="when-no-user">No Users available.</p>
        ) : (
          friends.map((friend) => (
            <React.Fragment key={friend._id}>
              <FriendCard
                key={friend._id}
                friend={friend}
                onShowFriends={handleShowFriends}
                onAddFriend={handleAddFriend}
                onDeleteFriend={handleDeleteFriend}
                onShowMutualFriends={handleShowMutualFriends}
                onShowDetails={handleShowDetails}
                selectedUser={selectedUser}
                currButtonSelected={currButtonSelected}
              />
              <div id="selecting">
                {selectedUser && selectedUser === friend._id && (
                  <>
                    {currButtonSelected === "userDetailsButton" &&
                      userDetailObj && (
                        <UserDetails userDetailObj={userDetailObj} />
                      )}
                    {currButtonSelected === "showFriendsButton" && arrayObj && (
                      <ShowFriends friends={arrayObj} />
                    )}
                    {currButtonSelected === "showMutualFriendsButton" &&
                      MutualObj && <ShowFriends friends={MutualObj} />}
                  </>
                )}
              </div>
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
