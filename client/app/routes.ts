import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  layout("./layouts/Auth.tsx", [
    route("/account/register", "./routes/account/register.tsx"),
    route("/account/verify-otp", "./routes/account/verify-otp.tsx"),
    route("/account/login", "./routes/account/login.tsx"),
  ]),

  layout("./layouts/Master.tsx", [
    ...(await flatRoutes()),
  ]),
] satisfies RouteConfig;
