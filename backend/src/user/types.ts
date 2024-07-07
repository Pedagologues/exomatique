export type User = {
    username: string,
    password: string,
    auth_token: string | undefined,
    auth_expire: number | undefined
}