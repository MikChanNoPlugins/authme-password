import type { PasswordManager } from "./password-manager.js";
import { randomHex, sha256 } from "./utility.js";

export class ShaPasswordManager implements PasswordManager {
	private static readonly SALT_LENGTH = 16;

	private async hashWithSalt(password: string, salt: string) {
		return await sha256((await sha256(password)) + salt);
	}

	async hash(password: string): Promise<string> {
		const salt = randomHex(ShaPasswordManager.SALT_LENGTH);
		const hash = await this.hashWithSalt(password, salt);
		return `$SHA$${salt}$${hash}`;
	}

	async isValid(password: string, hash: string): Promise<boolean> {
		const parts = hash.split("$");
		return (
			parts.length === 4 &&
			parts[1] === "SHA" &&
			!!parts[2] &&
			parts[3] === (await this.hashWithSalt(password, parts[2]))
		);
	}
}
