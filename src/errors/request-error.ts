import BaseError from "./base-error";

class RequestError extends BaseError {
  constructor(private message: string) {
    super();
  }
  statusCode = 500;
  resolver = () => {
    return [{ message: this.message }];
  };
}

export default RequestError;
