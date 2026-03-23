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
