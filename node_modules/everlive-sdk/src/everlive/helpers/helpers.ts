/**
 * @class Helpers
 * @classdesc Everlive helper classes
 */

import * as platform from '../../common/platform';
import { HtmlHelper } from './html/htmlHelper';

export interface HelperInfo {
    name: string;
    ctor: typeof HtmlHelper
}

export const helpers: HelperInfo[] = [];

if (platform.isCordova || platform.isDesktop) {
    helpers.push({
        name: 'html',
        ctor: HtmlHelper
    });
}
