
import { User } from './user.model';

export interface Scrap {
    uid?: string;
    title: string;
    description?: string;
    userUID: string;
    user?: User;
}