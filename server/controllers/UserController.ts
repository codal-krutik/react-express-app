import type { UserService } from "../services/UserService.js";
import { type Request, type Response } from "express";
import { validationResult } from 'express-validator';

export class UserController {
  constructor(private userService: UserService) { }

  register = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await this.userService.register(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      if (error.type === "validation") {
        return res.status(400).json({ errors: error.errors });
      }
      return res.status(500).json({ message: error.message });
    }
  };
}
