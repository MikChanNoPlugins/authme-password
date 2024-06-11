import { equal } from "node:assert/strict";
import { describe } from "node:test";
import { ShaPasswordManager } from "../sha.js";

await describe("ShaPasswordManager", async () => {
	const pm = new ShaPasswordManager();

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
