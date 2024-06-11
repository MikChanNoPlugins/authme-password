import { pbkdf2 } from "pbkdf2";
import type { PasswordManager } from "./password-manager.js";
import { randomHex } from "./utility.js";

const SALT_LENGTH = 16;
const NUMBER_OF_ITERATIONS = 10000;
const KEY_LEN = 64;
const DIGEST = "sha256";

const asyncPbkdf2 = (password: string, salt: string, iterations: number) =>
	new Promise<Buffer>((resolve, reject) =>
		pbkdf2(password, salt, iterations, KEY_LEN, DIGEST, (err, key) => {
			if (key) {
				resolve(key);
			} else {
				reject(err);
			}
		}),
	).then((res) => res.toString("hex"));

export class Pbkdf2PasswordManager implements PasswordManager {
	async hash(password: string): Promise<string> {
		const salt = randomHex(SALT_LENGTH);
		const hash = await asyncPbkdf2(password, salt, NUMBER_OF_ITERATIONS);
		return `pbkdf2_sha256$${NUMBER_OF_ITERATIONS}$${salt}$${hash}`;
	}

	async isValid(password: string, hash: string): Promise<boolean> {
		const parts = hash.split("$");
		if (
			parts.length !== 4 ||
			parts[0] !== "pbkdf2_sha256" ||
			typeof parts[1] !== "string" ||
			typeof parts[2] !== "string"
		) {
			return false;
		}

		const iters = Number.parseInt(parts[1]);
		return (
			!Number.isNaN(iters) &&
			parts[3] === (await asyncPbkdf2(password, parts[2], iters))
		);
	}
}
