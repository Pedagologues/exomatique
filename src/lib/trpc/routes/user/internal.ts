import { compare, hash } from '$trpc/crypto';
import Accounts from './db';
import type { DbUser, User } from './types';

const expiration = 7 * 24 * 3600;

function now() {
	return Math.floor(Date.now() / 1000);
}

export async function verify(token: string): Promise<[string, string, number] | undefined> {
	const valide_token = await Accounts.findOne({ auth_token: token });
	if (valide_token != null && (valide_token.auth_expire || 0) > now()) {
		return [token, valide_token._id.toHexString(), valide_token.auth_expire || 0];
	}
	return undefined;
}

export async function token(
	username: string,
	password: string
): Promise<[string, string, number] | null> {
	if (!password || !username) return null;
	const v = await Accounts.findOne({ username: username });
	if (v == null || !(await compare(password, v.password))) return null;
	if (v.auth_token == undefined || (v?.auth_expire || 0) <= now()) {
		let token = await hash(username + String(now()));
		let u = await Accounts.updateOne(
			{ _id: v._id },
			{
				$set: {
					auth_token: token,
					auth_expire: now() + expiration
				}
			}
		);
		return [token, v._id.toHexString(), v.auth_expire || 0];
	} else {
		return [v.auth_token, v._id.toHexString(), v.auth_expire || 0];
	}
}

export async function tokenToUser(token: string): Promise<User | undefined> {
	return await Accounts.findOne({ auth_token: token }).then(
		(v) =>
			({ username: v?.username, auth_expire: v?.auth_expire, auth_token: v?.auth_token }) as User
	);
}

export async function register(username: string, password: string): Promise<boolean> {
	const b = await Accounts.exists({ username: username });
	let exist = b != null;
	if (!exist)
		await Accounts.create({
			username: username,
			password: await hash(password)
		});
	return exist;
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
	const b = await Accounts.exists({ username: username });
	return b == null;
}

export async function loginFromToken(token: string): Promise<User> {
	let data = await verify(token);
	if (token == null || !data) throw new Error('Could not login');
	else {
		return {
			_id: data[1],
			username: (await tokenToUser(token).then((v) => v?.username)) as string,
			auth_token: data[0],
			auth_expire: data[2]
		};
	}
}

export async function loginFromPassword(username: string, password: string): Promise<User> {
	let token_ = await token(username, password);
	if (token_ == null) throw new Error('Could not login');
	else
		return {
			_id: token_[1],
			username: username,
			auth_token: token_[0],
			auth_expire: token_[2]
		};
}

export async function edition(
	username: string,
	password: string,
	edition: { username?: string; password?: string }
) {
	let newPassword = edition.password;
	let old_token = await token(username, password);
	if (old_token == null) throw new Error('Could not login');

	edition = {
		username: edition['username'],
		password: edition['password'] ? await hash(edition['password']) : undefined
	};

	await Accounts.updateOne({ username: username }, { $set: edition });

	let newUsername = edition.username || username;
	newPassword = newPassword || password;
	let token_ = await token(newUsername, newPassword);
	if (token_ == null) {
		throw new Error('An error occured while changing password, please contact an administrator');
	}

	return {
		username: newUsername,
		token: token_[0],
		id: token_[1],
		expiration: token_[2]
	};
}
