export interface PasswordManager {
	hash(password: string): Promise<string>;
	isValid(password: string, hash: string): Promise<boolean>;
}
