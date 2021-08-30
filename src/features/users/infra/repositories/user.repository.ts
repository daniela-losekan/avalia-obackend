import { UserEntity } from '../../../../core/infra';
import { User } from '../../domain';

export class UserRepository {
    async create(params: User): Promise<User> {
        const { username, email, password } = params;

        const user = await UserEntity.create({
            username,
            email,
            password,
        }).save();

        return Object.assign({}, params, user);
    }

    async getAll(): Promise<User[]> {
        const users = await UserEntity.find();

        return users.map(user => ({
            uid: user.uid,
            username: user.username,
            email: user.email,
            password: user.password,
        }));
    }

    async getByUid(uid: string): Promise<User | null> {
        const user = await UserEntity.findOne(uid);

        if (!user) {
            return null;
        }

        return {
            uid: user.uid,
            username: user.username,
            email: user.email,
            password: user.password,
        };
    }

    async update(uid: string, params: User): Promise<User | null> {
        const user = await UserEntity.findOne(uid);

        if (!user) {
            return null;
        }

        user.username = params.username;
        user.email = params.email;
        user.save();

        return {
            uid: user.uid,
            username: user.username,
            email: user.email,
            password: user.password,
        };
    }

    async delete(uid: string): Promise<void> {
        const user = await UserEntity.findOne(uid);

        if (user) {
            user.remove();
        }
    }
}