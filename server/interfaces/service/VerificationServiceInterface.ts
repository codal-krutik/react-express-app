import type { SendType, VerifyInputDTO } from "../../dtos/VerificationDTO.js";

export interface VerificationServiceInterface {
  send(email: string, type: SendType): Promise<{ message: string }>;
  verify(data: VerifyInputDTO): Promise<{ message: string }>;
}
