import { writable, type Writable } from 'svelte/store';
import type { User } from '../lib/trpc/routes/user/types';

export const user: Writable<User | undefined> = writable(undefined as User | undefined);
