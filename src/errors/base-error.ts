interface errorStruct {
  message: string;
  field?: string;
}

abstract class BaseError {
  abstract statusCode: number;
  abstract resolver(): errorStruct[];
}
export default BaseError;
