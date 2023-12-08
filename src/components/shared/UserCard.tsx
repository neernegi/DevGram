import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useFollowUser,
  useGetUserById,
  useGetUsers,
} from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import Loader from "./Loader";

type UserCardProps = {
  user: Models.Document;
};

type FollowStatus = {
  [userId: string]: boolean;
};



const UserCard = () => {
  const { user: currentUser } = useUserContext();
  // const { data: followUsers } = useGetUserById(id);
  const { mutateAsync: followUser } = useFollowUser();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);
  console.log(creators)
  const filteredUsers = creators?.documents.filter(
    (user) => user.$id !== currentUser.id
  );
  console.log("users :",filteredUsers)
  const following = filteredUsers?.map((flw) => flw.following)
  console.log(following)
  const isFollowing = following?.map((isf) =>isf.isFollowing)
  console.log(isFollowing)

  const [followStatus, setFollowStatus] = useState<FollowStatus>({});

  useEffect(() => {
    // Initialize follow status for users (assuming users is an array of users)
    if (creators) {
      const initialStatus: FollowStatus = {};
      creators.documents.forEach((creator) => {
        initialStatus[creator?.$id] = false; // Initially, no user is followed
      });
      setFollowStatus(initialStatus);
    }
  }, [creators]);

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


  // let allFollowingArrays: any = [];
  // if (Array.isArray(filteredUsers?.follower)) {
  //   allFollowingArrays = filteredUsers?.follower.map(
  //     (follower: any) => follower.following
  //   );

  //   // 'allFollowingArrays' contains an array of 'following' arrays from each follower object
  //   console.log(allFollowingArrays);
  // } else {
  //   console.log(
  //     "Follower array is empty or not present in the current user object"
  //   );
  // }


  if (isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div>
        <h3 className="h3-bold m-2 text-white">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <>
            {filteredUsers?.map((creator) => (
              <div key={creator.$id} className="mt-4 border border-off-white bg-slate-200 rounded-[20px] py-4" style={{ width: "35vh" }}>
                <Link to={`/profile/${creator.$id}`} className="user-card ">
                  <img
                    src={
                      creator.imageUrl ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                 
                    alt="creator"
                    className="rounded-full w-16 h-16"
                  />

                  <div className="flex-center flex-col gap-1">
                    <p
                      className="base-medium  text-black text-center line-clamp-1"
                      style={{ fontSize: "1.2rem" }}
                    >
                      {creator.name}
                    </p>
                    <p
                      className="small-regular text-gray-700 text-center line-clamp-1"
                      style={{ fontSize: "1rem" }}
                    >
                      @{creator.username}
                    </p>
                  </div>
                </Link>
                <Button
                  onClick={() => followHandler(creator.$id)}
                  type="button"
                  size="sm"
                  className="bg-slate-800 text-white lg:ml-48"
               
                >
                  {followStatus[creator.$id] ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </>
        )}
      </div>
      {/* <Link to={`/profile/${.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </Link> */}
    </>
  );
};

export default UserCard;
