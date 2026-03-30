import { Outlet, redirect } from "react-router";
import axios from "axios";
import type { Route } from "./+types/Auth";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const cookie = request.headers.get("cookie") ?? "";

    const { data } = await axios.get("http://localhost:3000/api/authenticate", {
      withCredentials: true,
      headers: {
        cookie,
      },
    });

    if (!data.success) {
      throw redirect("/account/login");
    }
    throw redirect("/");
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }
    throw new Response("Something went wrong", { status: 500 });
  }
}

export default function Auth() {
  return <Outlet />;
}
