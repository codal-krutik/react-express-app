import type { Request } from "express";
import type { CustomJwtPayload } from "./JwtDTO.js";

export interface AuthRequest extends Request {
  user?: CustomJwtPayload;
}

export interface LoginDTO {
  emailOrUsername: string;
  password: string;
}

export interface LoginResponseDTO {
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
}
