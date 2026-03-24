import type { LoginDTO, LoginResponseDTO } from "../../dtos/AuthDTO.js";
import type { UserDocument } from "../../models/User.js";

export interface AuthServiceInterface {
  authenticate(userId: string): Promise<UserDocument>
  login(data: LoginDTO): Promise<LoginResponseDTO>
}
