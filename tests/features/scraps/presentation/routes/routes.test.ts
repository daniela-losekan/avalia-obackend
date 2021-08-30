import express, { Router } from 'express';
import request from 'supertest';
import { ScrapEntity, UserEntity } from '../../../../../src/core/infra';
import App from '../../../../src/core/presentation/app';
import { Scrap } from '../../../../../src/core/domain/models';
import { ScrapRepository } from '../../../../../src/features/scraps/infra';
import Database from '../../../../../src/core/infra/data/connections/database';
import ScrapRoutes from '../../../../../src/features/scraps/presentation/routes/scrap.routes';

jest.mock(
    '../../../../../src/features/scraps/infra/repositories/scrap.repository.ts',
);

const makeUser = async (): Promise<UserEntity> => {
    return UserEntity.create({
        username: 'any_username',
        email: 'any_email',
        password: 'any_pass',
    }).save();
};

const makeScrap = async (): Promise<Scrap> => {
    const user = await makeUser();

    return ScrapEntity.create({
        title: 'any_title',
        description: 'any_description',
        userUID: user.uid,
    }).save();
};

describe('Scrap routes', () => {
    const server = new App().server;

    beforeEach(async () => {
        await ScrapEntity.clear();
        await UserEntity.clear();

        jest.resetAllMocks();
    });

    beforeAll(async () => {
        await new Database().openConnection();

        const router = Router();
        server.use(express.json());

        server.use(router);

        new ScrapRoutes().init(router);
    });

    afterAll(async () => {
        await new Database().disconnectDatabase();
    });

    describe('/Post scraps', () => {
        test('should return code 400 when save scrap with invalid title', async () => {
            const user = await makeUser();

            await request(server)
                .post('/scraps')
                .send({
                    description: 'any_description',
                    userUID: user.uid,
                })
                .expect(400, { error: 'Missing param: name' });
        });
        test('should return code 200 when save a new scrap', async () => {
            const scrap = await makeScrap();

            jest.spyOn(ScrapRepository.prototype, 'create').mockResolvedValue(
                scrap,
            );

            await request(server)
                .post('/scraps')
                .send({
                    title: 'any_title',
                    description: 'any_description',
                    userUID: scrap.userUID,
                })
                .expect(200)
                .expect(request => {
                    expect(request.body.userUID).toBe(scrap.userUID);
                });
        });
        test('should return code 400 when userUID is invalid', async () => {
            await request(server)
                .post('/scraps')
                .send({
                    title: 'any_title',
                    description: 'any_description',
                })
                .expect(400, { error: 'Invalid param: userUID' });
        });
    });

    describe('/Get scraps', () => {
        test('should return code 200 when has any scrap', async () => {
            const scrap = await makeScrap();

            jest.spyOn(ScrapRepository.prototype, 'getAll').mockResolvedValue([
                scrap,
            ]);

            await request(server).get(`/users/${scrap.userUID}/scraps`).send().expect(200);
        });
    });

    describe('/Get/ scraps/:uid', () => {
        test('should return code 200 when get scrap by uid', async () => {
            const scrap = await makeScrap();

            jest.spyOn(ScrapRepository.prototype, 'getByUid').mockResolvedValue(
                scrap,
            );

            await request(server)
                .get(`/users/${scrap.userUID}/scraps/${scrap.uid}`)
                .send()
                .expect(200)
                .expect(request => {
                    expect(request.body.uid).toEqual(scrap.uid);
                });
        });
    });
});