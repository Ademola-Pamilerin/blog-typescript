import jwt, { TokenExpiredError } from "jsonwebtoken";
import { promisify } from "util";

interface payloadType {
  email: string;
  id: string;
}

const jwtProvider = (payload: payloadType) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!);
  return token;
};

const verifyAsync = promisify<string, string>(jwt.verify);

const jwtVerifier = async (token: string) => {
  try {
    const payload = await verifyAsync(token, process.env.JWT_SECRET!);
    return payload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw { message: "Token Expired, login again to continue" };
    } else {
      throw { message: "An error occured try agan later" };
    }
  }
};
export { jwtProvider, jwtVerifier };
