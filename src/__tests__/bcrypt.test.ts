import { equal } from "node:assert/strict";
import { describe } from "node:test";
import { BcryptPasswordManager } from "../bcrypt.js";

await describe("BcryptPasswordManager", async () => {
	const sha = new BcryptPasswordManager();

	await describe("given some random password", async () => {
		const password = "Hello world";

		await describe("can hash it", async () => {
			const hash = await sha.hash(password);

			await describe("and can validate it", async () => {
				const isValid = await sha.isValid(password, hash);
				equal(isValid, true);
			});
		});
	});
});
