import { equal } from "node:assert/strict";
import { describe } from "node:test";
import { Pbkdf2PasswordManager } from "../pbkdf2.js";

await describe("Pbkdf2PasswordManager", async () => {
	const pm = new Pbkdf2PasswordManager();

	await describe("given some random password", async () => {
		const password = "Hello world";

		await describe("can hash it", async () => {
			const hash = await pm.hash(password);

			await describe("and can validate it", async () => {
				const isValid = await pm.isValid(password, hash);
				equal(isValid, true);
			});
		});
	});
});
