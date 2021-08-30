import { ScrapEntity } from '../../../../core/infra';
import { Scrap } from '../../domain';

export class ScrapRepository {
    async create(params: Scrap): Promise<Scrap> {
        const { title, description, userUID } = params;

        const scrap = await ScrapEntity.create({
            title,
            description,
            userUID,
        }).save();

        return Object.assign({}, params, scrap);
    }

    async getAll(): Promise<Scrap[]> {
        const scraps = await ScrapEntity.find();

        return scraps.map(scrap => ({
            uid: scrap.uid,
            title: scrap.title,
            description: scrap.description,
            userUID: scrap.userUID,
        }));
    }

    async getByUid(uid: string): Promise<Scrap | null> {
        const scrap = await ScrapEntity.findOne(uid);

        if (!scrap) {
            return null;
        }

        return {
            uid: scrap.uid,
            title: scrap.title,
            description: scrap.description,
            userUID: scrap.userUID,
        };
    }

    async update(uid: string, params: Scrap): Promise<Scrap | null> {
        const scrap = await ScrapEntity.findOne(uid);

        if (!scrap) {
            return null;
        }

        scrap.title = params.title;
        scrap.description = params.description;
        scrap.save();

        return {
            uid: scrap.uid,
            title: scrap.title,
            description: scrap.description,
            userUID: scrap.userUID,
        };
    }

    async delete(uid: string): Promise<void> {
        const scrap = await ScrapEntity.findOne(uid);

        if (scrap) {
            scrap.remove();
        }
    }
}