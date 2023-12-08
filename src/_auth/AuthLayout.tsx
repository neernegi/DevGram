import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <>
      {isAuthenticated ? (
        <section className="flex flex-1 justify-center items-center flex-col py-10">
          <Outlet />
        </section>
      ) : (
        <>
          <Navigate to={"/sign-in"} />
        </>
      )}
    </>
  );
};

export default AuthLayout;
