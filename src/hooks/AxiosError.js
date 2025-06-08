export class AxiosError {
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
