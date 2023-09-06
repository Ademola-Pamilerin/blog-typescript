import BaseError from "./base-error";

class GeneralError extends BaseError {
  constructor(private message: string, private code: number) {
    super();
  }
  statusCode = this.code;
  resolver = () => {
    return [{ message: this.message }];
  };
}

export default GeneralError;
