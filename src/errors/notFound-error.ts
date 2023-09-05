import BaseError from "./base-error";

class NotFound extends BaseError {
  constructor() {
    super();
  }
  statusCode = 404;
  resolver = () => {
    return [{ message: "page not found try, check your url again" }];
  };
}

export default NotFound;
