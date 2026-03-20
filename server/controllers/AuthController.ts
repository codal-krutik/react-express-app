import { type Request, type Response } from "express";
import type { UserService } from "../services/UserService.js";

export class UserController {
  constructor(private userService: UserService) { }

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.register(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
}
