import { Navigate } from "react-router-dom";

function Private({ children }) {

  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default Private;
