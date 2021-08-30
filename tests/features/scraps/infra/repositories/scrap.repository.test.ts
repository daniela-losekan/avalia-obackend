import { UserEntity, ScrapEntity } from '../../../../../src/core/infra';
import { Scrap } from '../../../../src/core/domain';
import { ScrapRepository } from '../../../../../src/features/scraps/infra';
import Database from '../../../../../src/core/infra/data/connections/database';

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

const makeParams = async () => {
    const user = await makeUser();

    return {
        title: 'any_title',
        description: 'any_description',
        userUID: user.uid,
    };
};

describe('Scrap Repository', () => {
    beforeAll(async () => {
        await new Database().openConnection();
    });

    beforeEach(async () => {
        await ScrapEntity.clear();
        await UserEntity.clear();
    });

    afterAll(async () => {
        await new Database().disconnectDatabase();
    });

    describe('Create', () => {
        test('should create a new scrap when has valid params', async () => {
            const params = await makeParams();
            const scrap = new ScrapRepository();
            const result = await scrap.create(params);

            expect(result).toBeTruthy();
            expect(result.uid).toBeTruthy();
            expect(result.title).toEqual(params.title);
            expect(result.description).toEqual(params.description);
            expect(result.userUID).toEqual(params.userUID);
        });
    });

    describe('GetAll', () => {
        test('should return a list of scraps when has any scrap', async () => {
            const scrap = await makeScrap();

            jest.spyOn(ScrapRepository.prototype, 'getAll').mockResolvedValue([
                scrap,
            ]);

            const sut = new ScrapRepository();
            const result = await sut.getAll();

            expect(result.length > 0).toBeTruthy();
        });
    });

    describe('GetByUid', () => {
        test('should return a scrap when has a scrap with uid defined', async () => {
            const scrap = await makeScrap();

            jest.spyOn(ScrapRepository.prototype, 'getByUid').mockResolvedValue(
                scrap,
            );

            const sut = new ScrapRepository();
            const result = await sut.getByUid(scrap.uid);

            expect(result.uid).toEqual(scrap.uid);
        });
    });

    describe('Update', () => {
        test('Should return a scrap when database has scrap that match params', async () => {
            const sut = new ScrapRepository();
            const scrap = await makeScrap();

            const result = (await sut.update(scrap.uid, {
                title: scrap.title,
                description: scrap.description,
                userUid: scrap.userUID,
            } as any)) as any;

            expect(result).toBeTruthy();
            expect(result.uid).toEqual(scrap.uid);
            expect(result.title).toEqual(scrap.title);
            expect(result.description).toEqual(scrap.description);
            expect(result.userUID).toEqual(scrap.userUID);
        });
    });
    describe('Delete', () => {
        test('Should pass a scrapUid as parameters in the function call', async () => {
            const sut = new ScrapRepository();
            jest.spyOn(sut, 'delete').mockResolvedValue(null);
            const spy = jest.spyOn(sut, 'delete');
            await sut.delete('any_uid');

            expect(spy).toHaveBeenCalledWith('any_uid');
            expect(spy).toHaveBeenCalledTimes(1);
        });
        test('Should delete an scrap if all params are valid', async () => {
            const sut = new ScrapRepository();
            const scrap = await makeScrap();
            const result = (await sut.delete(scrap.uid)) as any;

            expect(result).toBeTruthy();
            expect(result.uid).toBeFalsy();
        });
    });
});