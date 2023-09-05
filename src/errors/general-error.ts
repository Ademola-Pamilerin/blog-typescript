import BaseError from "./base-error";

class GeneralError extends BaseError {
  constructor(private message: string) {
    super();
  }
  statusCode = 400;
  resolver = () => {
    return [{ message: this.message }];
  };
}

export default GeneralError;
