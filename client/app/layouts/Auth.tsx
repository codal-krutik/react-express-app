import { Outlet, redirect } from "react-router";
import axios from "axios";
import type { Route } from "./+types/Auth";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const cookie = request.headers.get("cookie") ?? "";
    
    await axios.get("http://localhost:3000/api/authenticate", {
      withCredentials: true,
      headers: {
        cookie
      }
    });

    throw redirect("/");
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

export default function Auth() {
  return <Outlet />;
}
