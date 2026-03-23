import type { LoginDTO, LoginResponseDTO } from "../dtos/AuthDTO.js";
import type { AuthServiceInterface } from "../interfaces/service/AuthServiceInterface.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { sign } from "../utils/jwt.js";

export class AuthService implements AuthServiceInterface {
  constructor(private userRepository: UserRepository) { }

  async login(data: LoginDTO): Promise<LoginResponseDTO> {
    const { emailOrUsername, password } = data;

    const user = await this.userRepository.findByEmailOrUsername(emailOrUsername);

    if (!user) {
      throw {
        type: "validation",
        errors: [{ msg: "Invalid credentials", path: "emailOrUsername" }],
      };
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw {
        type: "validation",
        errors: [{ msg: "Invalid credentials", path: "password" }],
      };
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const token = sign(payload);

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
      token,
    };
  };
}
