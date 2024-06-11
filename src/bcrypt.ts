import type { PasswordManager } from "./password-manager.js";
import { hash, compare } from "bcrypt";

export class BcryptPasswordManager implements PasswordManager {
	private static readonly SALT_ROUNDS = 12;

	hash(password: string): Promise<string> {
		return hash(password, BcryptPasswordManager.SALT_ROUNDS);
	}

	isValid(password: string, hash: string): Promise<boolean> {
		return compare(password, hash);
	}
}
