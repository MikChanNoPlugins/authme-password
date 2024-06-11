import type { PasswordManager } from "./password-manager.js";
import { randomHex, sha256 } from "./utility.js";

const SALT_LENGTH = 16;

const hashWithSalt = async (password: string, salt: string) =>
	sha256((await sha256(password)) + salt);

export class ShaPasswordManager implements PasswordManager {
	async hash(password: string): Promise<string> {
		const salt = randomHex(SALT_LENGTH);
		const hash = await hashWithSalt(password, salt);
		return `$SHA$${salt}$${hash}`;
	}

	async isValid(password: string, hash: string): Promise<boolean> {
		const parts = hash.split("$");
		return (
			parts.length === 4 &&
			parts[1] === "SHA" &&
			typeof parts[2] === "string" &&
			parts[3] === (await hashWithSalt(password, parts[2]))
		);
	}
}
