import React from "react";

function UserDetails({ userDetailObj }) {
  return (
    <>
      <div className="user-details">
        <div className="inside-user-details">
          <p>name: {userDetailObj.name}</p>
          <p>id: {userDetailObj._id}</p>
          {userDetailObj.friends.length === 0 ? (
            <p>No friends!!</p>
          ) : (
            <div className="inside-user-details-friends-array">
              <p classname="user-detail-inline-block">Friends: </p>
              <p classname="user-detail-inline-block">[</p>
              {userDetailObj.friends.map((friend, index) => (
                <div classname="user-detail-inline-block" key={friend}>
                  <p classname="user-detail-inline-block">{friend},</p>
                </div>
              ))}
              <p className="inline-Display">]</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default UserDetails;
