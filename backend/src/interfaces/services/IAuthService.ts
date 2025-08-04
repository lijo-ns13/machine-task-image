import { AuthResponseDTO, SigninDTO, SignupDTO } from "../../dtos/auth.dto";

export interface IAuthService {
  signup(data: SignupDTO): Promise<AuthResponseDTO>;
  signin(data: SigninDTO): Promise<AuthResponseDTO>;
}
