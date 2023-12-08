import {
  useFollowUser,
  useGetUsers,
} from "@/lib/react-query/queriesAndMutations";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";

type FollowStatus = {
  [userId: string]: boolean;
};

const Follow = () => {
  const { user: currentUser } = useUserContext();
  const { data: users, isLoading } = useGetUsers();
  const { mutateAsync: followUser } = useFollowUser();

  const [followStatus, setFollowStatus] = useState<FollowStatus>({});
  // Inside your component where you retrieve users
  const filteredUsers = users?.filter((user) => user.$id !== currentUser.id);
  

  useEffect(() => {
    // Initialize follow status for users (assuming users is an array of users)
    if (users) {
      const initialStatus:FollowStatus = {};
      users.forEach((user) => {
        initialStatus[user?.$id] = false; // Initially, no user is followed
      });
      setFollowStatus(initialStatus);
    }
  }, [users]);

  
  const followHandler = async (following: string) => {
    try {
      // Perform follow action here
      await followUser({
        
        follower: currentUser.id,
        following: following,
      });

      // Update follow status after successful follow action for the specific user
      setFollowStatus((prevStatus) => ({
        ...prevStatus,
        [following]: true, // Set follow status for the specific user to true
      }));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };


  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        filteredUsers?.map((user) => (
          <div key={user.$id}>
            <div
              className="bg-slate-300 mb-6 p-3 flex items-center justify-between"
              style={{ borderRadius: 12 }}
            >
              <img
                src={user.imageUrl}
                alt={user.name}
                width={50}
                className="rounded-xl"
              />
              <h3>{user.name}</h3>
              <Button
                className="bg-slate-700 text-white"
                onClick={() => followHandler(user?.$id)} 
              > {followStatus[user.$id] ? "Following" : "Follow"}
              </Button>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default Follow;
