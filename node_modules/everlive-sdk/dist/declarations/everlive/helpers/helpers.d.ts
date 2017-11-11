import { HtmlHelper } from './html/htmlHelper';
export interface HelperInfo {
    name: string;
    ctor: typeof HtmlHelper;
}
export declare const helpers: HelperInfo[];
