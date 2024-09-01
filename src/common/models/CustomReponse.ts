import { StatusCodes } from "http-status-codes";

export class CustomResponse<T = null> {
  readonly success: boolean;
  readonly message: string;
  readonly responseObject: T;
  readonly statusCode: number;

  private constructor(success: boolean, message: string, responseObject: T, statusCode: number) {
    this.success = success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }

  static success<T>(message: string, responseObject: T, statusCode: number = StatusCodes.OK) {
    return new CustomResponse(true, message, responseObject, statusCode);
  }

  static error<T>(message: string, responseObject: T, statusCode: number = StatusCodes.BAD_REQUEST) {
    return new CustomResponse(false, message, responseObject, statusCode);
  }
}
