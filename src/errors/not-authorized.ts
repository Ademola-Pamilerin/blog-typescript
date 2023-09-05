import BaseError from "./base-error";

class notAuthorized extends BaseError {
  constructor() {
    super();
  }
  statusCode = 403;
  resolver() {
    return [{ message: "UnAuthorized" }];
  }
}
export default notAuthorized;
