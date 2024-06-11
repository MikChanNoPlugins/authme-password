import { BcryptPasswordManager } from "./bcrypt.js";
import type { PasswordManager } from "./password-manager.js";
import { Pbkdf2PasswordManager } from "./pbkdf2.js";
import { ShaPasswordManager } from "./sha.js";

const passwordManagers = {
	sha: ShaPasswordManager,
	pbkdf2: Pbkdf2PasswordManager,
	bcrypt: BcryptPasswordManager,
} as const;

type PasswordManagerType = keyof typeof passwordManagers;

export class AuthMePasswordManager implements PasswordManager {
	private readonly pm: PasswordManager;

	constructor(defaultType: PasswordManagerType = "sha") {
		this.pm = new passwordManagers[defaultType]();
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
