import {
  type RouteConfig,
  index,
  layout,
} from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  layout("./layouts/Main.tsx", [
    // index("./routes/dashboard.tsx"),
  ]),

  ...(await flatRoutes()),
] satisfies RouteConfig;
