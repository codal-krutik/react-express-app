import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  route("/account/login", "./routes/account.login.tsx"),
  route("/account/register", "./routes/account.register.tsx"),

  layout("./layouts/Master.tsx", [
    index("./routes/_index.tsx"),
    /* ...(await flatRoutes({
      ignoredRouteFiles: [
        "./routes/account.register.tsx",
        "./routes/account.login.tsx"
      ],
    })), */
  ]),
] satisfies RouteConfig;
