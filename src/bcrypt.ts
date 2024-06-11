import { compare, hash } from "bcrypt";
import type { PasswordManager } from "./password-manager.js";

const SALT_ROUNDS = 12;

export class BcryptPasswordManager implements PasswordManager {
	hash(password: string): Promise<string> {
		return hash(password, SALT_ROUNDS);
	}

	isValid(password: string, hash: string): Promise<boolean> {
		return compare(password, hash);
	}
}
