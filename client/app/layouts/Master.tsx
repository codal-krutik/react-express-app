import { Outlet, redirect } from "react-router";
import axios from "axios";
import type { Route } from "./+types/Master";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const { data } = await axios.get("http://localhost:3000/api/auth/authenticate", {
      withCredentials: true,
    });
    console.log('data', data);

    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw redirect("/account/login");
    }
    throw error;
  }
}

export default function Master() {
  return <Outlet />;
}
