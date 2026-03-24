import type { Route } from "./+types/_index";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { unsetAuthenticatedUser } from "~/store/authSlice";
import axios from "axios";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, {
        withCredentials: true,
      });

      dispatch(unsetAuthenticatedUser());
      navigate("/account/login");
    } catch (error: any) {
      throw error;
    }
  }

  return (
    <>
      <p>New React Router App</p>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
