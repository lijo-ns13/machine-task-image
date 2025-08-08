import { Request, Response } from "express";

import { inject } from "inversify";

import { TYPES } from "../di/types";
import { handleControllerError } from "../utils/errorHandler";
import { ICommonService } from "../services/common.service";

export interface ICommonController {
  refreshAccessToken(req: Request, res: Response): Promise<void>;
}
export class CommonController implements ICommonController {
  constructor(
    @inject(TYPES.CommonService) private _commonService: ICommonService
  ) {}
  async refreshAccessToken(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._commonService.refreshAccessToken(
        req.cookies.refreshToken
      );
      res
        .cookie("accessToken", result.token, result.cookieOptions)
        .json({ success: true });
    } catch (error) {
      handleControllerError(error, res, "refresaccesstoken");
    }
  }
}
