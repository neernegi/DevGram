
import UserCard from "@/components/shared/UserCard";


const AllUsers = () => {
  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        <UserCard />
      </div>
    </div>
  );
};

export default AllUsers;
