import { Outlet, redirect, useLoaderData } from "react-router";
import axios from "axios";
import type { Route } from "./+types/Master";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthenticatedUser } from "~/store/authSlice";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const cookie = request.headers.get("cookie") ?? "";

    const { data } = await axios.get("http://localhost:3000/api/auth/authenticate", {
      withCredentials: true,
      headers: {
        cookie
      }
    });

    return data.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw redirect("/account/login");
    }
    throw error;
  }
}

export default function Master() {
  const user = useLoaderData();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setAuthenticatedUser(user));
    }
  }, [dispatch, user]);

  return <Outlet />;
}
