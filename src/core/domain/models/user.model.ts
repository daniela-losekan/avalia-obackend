
import { Scrap } from './scr.model';

export interface User {
    uid: string;
    username: string;
    email: string;
    password?: string;
    scraps?: Scrap[];
}