import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const isLoading = true;

const UserProfile = () => {
  return (
    <div className="container md:mx-auto p-4">
      {isLoading ? (
        <>
          <div className={"grid grid-cols-2 gap-1"}>
            <Skeleton height={50} width={"100%"} />
            <Skeleton height={50} width={"100%"} />
          </div>
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={50} width={"100%"} />
          <Skeleton height={20} width={"60%"} />
          <Skeleton height={40} width={200} />
          <p>
            <Skeleton inline width={100} /> is typing...
          </p>
          <img src="http://localhost:5050/uploads/1740833945386.svg" alt="sss"/>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">jakaria</h2>
        </>
      )}
    </div>
  );
};

export default UserProfile;
