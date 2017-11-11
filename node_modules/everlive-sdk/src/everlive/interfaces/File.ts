import { Item } from './Item';

export interface File extends Item {
    ContentType: string;
    Filename: string;
    Length: string;
    Storage: string;
    Uri: string;
}