import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
export default class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(stored_password: string, supplied_password: string) {
    const [hashedPassword, salt] = stored_password.split(".");
    const buf = (await scryptAsync(supplied_password, salt, 64)) as Buffer;
    return buf.toString("hex") === hashedPassword;
  }
}
