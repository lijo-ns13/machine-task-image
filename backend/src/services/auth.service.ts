import { inject } from "inversify";
import { TYPES } from "../di/types";

export class AuthService implements IAuthService {
    constructor(
        @inject(TYPES.)
    ){}
  async signup(data:){

  }
  async signin(data){

  }
}
