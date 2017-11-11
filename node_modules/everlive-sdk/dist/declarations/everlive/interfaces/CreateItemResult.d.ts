import { SingleResult } from './SingleResult';
export interface CreateItemResult extends SingleResult<{
    CreatedAt: Date;
    Id: string;
}> {
}
