import { Router } from 'express';
import { EMVC } from '../../../../core/presentation';
import {
    middlewareAdapter,
    routerMvcAdapter,
} from '../../../../core/presentation';
import { ScrapController } from '../controllers';
import { ScrapMiddleware } from '../middlewares';
import { MVCController } from '../../../../core/presentation';
import { ScrapRepository } from '../../infra';
import { CacheRepository } from '../../infra';

const makeController = (): MVCController => {
    const repository = new ScrapRepository();
    const cache = new CacheRepository();
    return new ScrapController(repository, cache);
};

export default class ScrapRoutes {
    public init(routes: Router) {
        routes.get(
            '/users/:userUID/scraps',
            routerMvcAdapter(makeController(), EMVC.INDEX),
        );

        routes.get(
            '/users/:userUID/scraps/:uid',
            routerMvcAdapter(makeController(), EMVC.SHOW),
        );

        routes.post(
            '/users/:userUID/scraps',
            middlewareAdapter(new ScrapMiddleware()),
            routerMvcAdapter(makeController(), EMVC.STORE),
        );

        routes.put(
            '/users/:userUID/scraps/:uid',
            middlewareAdapter(new ScrapMiddleware()),
            routerMvcAdapter(makeController(), EMVC.UPDATE),
        );

        routes.delete(
            '/users/:userUID/scraps/:uid',
            routerMvcAdapter(makeController(), EMVC.DELETE),
        );
    }
}