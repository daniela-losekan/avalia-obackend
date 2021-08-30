import { HttpRequest, HttpResponse } from '../../../../core/presentation';
import { notFound, ok, serverError } from '../../../../core/presentation';
import { MVCController } from '../../../../core/presentation';
import { CacheRepository, UserRepository } from '../../infra';

export class UserController implements MVCController {
    readonly #repository: UserRepository;
    readonly #cache: CacheRepository;

    constructor(repository: UserRepository, cache: CacheRepository) {
        this.#repository = repository;
        this.#cache = cache;
    }

    public async index(request: HttpRequest): Promise<HttpResponse> {
        try {
            const cache = await this.#cache.get('user:all');

            if (cache) {
                return ok(cache);
            }

            const users = await this.#repository.getAll();
            await this.#cache.set('user:all', users);

            return ok(users);
        } catch (error) {
            return serverError();
        }
    }

    public async show(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { uid } = request.params;
            const cache = await this.#cache.get(`user:${uid}`);

            if (cache) {
                return ok(cache);
            }

            const user = await this.#repository.getByUid(uid);

            if (!user) {
                return notFound();
            }

            await this.#cache.set(`user:${uid}`, user);

            return ok(user);
        } catch (error) {
            return serverError();
        }
    }

    public async store(request: HttpRequest): Promise<HttpResponse> {
        try {
            const user = await this.#repository.create(request.body);
            await this.#cache.del('user:all');
            return ok(user);
        } catch (error) {
            return serverError();
        }
    }

    public async update(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { uid } = request.params;

            const user = await this.#repository.update(uid, request.body);

            await this.#cache.set(`user:${uid}`, user);
            await this.#cache.del('user:all');

            return ok(user);
        } catch (error) {
            return serverError();
        }
    }

    public async delete(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { uid } = request.params;
            await this.#repository.delete(uid);

            await this.#cache.del(`user:${uid}`);
            await this.#cache.del('user:all');

            return ok({});
        } catch (error) {
            return serverError();
        }
    }
}