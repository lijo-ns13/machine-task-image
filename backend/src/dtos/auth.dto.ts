export interface SignupDTO {
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
}

export interface SigninDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: number;
    createdAt: Date;
    updatedAt: Date;
  };
}
