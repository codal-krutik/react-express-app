import { type RouteConfig, layout, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  layout("./layouts/Auth.tsx", [
    route("/account/register", "./routes/auth/register.tsx"),
    route("/account/login", "./routes/auth/login.tsx"),
  ]),

  route("/account/verify", "./routes/auth/verify.tsx"),

  layout("./layouts/Master.tsx", [...(await flatRoutes())]),
] satisfies RouteConfig;
