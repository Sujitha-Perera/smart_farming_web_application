import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-green-50">
      {/* Login box */}
      <div className=" w-full max-w-110">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
