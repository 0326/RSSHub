import type { Handler } from 'hono';

import { namespaces } from '@/registry';
import Index from '@/views/index';

const handler: Handler = (ctx) => {
    ctx.header('Cache-Control', 'no-cache');

    return ctx.html(<Index debugQuery={ctx.req.query('debug')} namespaces={namespaces} />);
};

export default handler;
