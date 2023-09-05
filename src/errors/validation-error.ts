import BaseError from "./base-error";
import { ValidationError } from "express-validator";

interface validation {
  message: string;
  field: string;
}

class ValidationErrorClass extends BaseError {
  total_error: validation[] = [];
  private constructor() {
    super();
  }

  statusCode = 403;
  private static instance: ValidationErrorClass;

  static createClass() {
    this.instance = new ValidationErrorClass();
    return this.instance;
  }

  //   this is to error from express Validator
  add_error = (errorVal: ValidationError) => {
    if (errorVal.type === "field") {
      this.total_error.push({ message: errorVal.msg, field: errorVal.path });
    }
  };
  add_custom = (error: validation) => {
    this.total_error.push(error);
  };
  resolver() {
    return this.total_error;
  }
}

export default ValidationErrorClass;
