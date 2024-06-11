import { BcryptPasswordManager } from "./bcrypt.js";
import type { PasswordManager } from "./password-manager.js";
import { Pbkdf2PasswordManager } from "./pbkdf2.js";
import { ShaPasswordManager } from "./sha.js";

export type PasswordManagerType = "sha" | "pbkdf2" | "bcrypt";

export class AuthMePasswordManager implements PasswordManager {
	private readonly pm: PasswordManager;

	constructor(defaultType: PasswordManagerType = "sha") {
		this.pm = (() => {
			switch (defaultType) {
				case "sha":
					return new ShaPasswordManager();
				case "pbkdf2":
					return new Pbkdf2PasswordManager();
				case "bcrypt":
					return new BcryptPasswordManager();
			}
		})();
	}

	hash(password: string): Promise<string> {
		return this.pm.hash(password);
	}

	isValid(password: string, hash: string): Promise<boolean> {
		if (hash.startsWith("$SHA$")) {
			return new ShaPasswordManager().isValid(password, hash);
		}

		if (hash.startsWith("pbkdf2_sha256$")) {
			return new Pbkdf2PasswordManager().isValid(password, hash);
		}

		if (hash.startsWith("$2a$") || hash.startsWith("$2b$")) {
			return new BcryptPasswordManager().isValid(password, hash);
		}

		return Promise.resolve(false);
	}
}
