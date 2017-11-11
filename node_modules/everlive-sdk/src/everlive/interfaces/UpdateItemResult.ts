import { SingleResult } from './SingleResult';

export interface UpdateItemResult extends SingleResult<number> {
    ModifiedAt: Date;
}