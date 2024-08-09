import { t } from './router';

import { router as DocumentRouter } from './routes/document/router';
import { router as ProcedureRouter } from './routes/procedure/router';
import { router as UserRouter } from './routes/user/router';

export const router = t.router({
	ping: t.procedure.query(() => 'Pong'),
	user: UserRouter,
	procedure: ProcedureRouter,
	document: DocumentRouter
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
