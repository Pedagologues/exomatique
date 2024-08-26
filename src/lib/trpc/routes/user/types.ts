export type User = {
	_id: string;
	username: string;
	auth_token: string | undefined;
	auth_expire: number | undefined;
};

export type DbUser = User & { password: string };
