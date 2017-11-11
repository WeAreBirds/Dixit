import * as _ from 'underscore';

import {deepExtend} from './underscoreDeepExtend';
import {compactObject} from './underscoreCompactObject';
import {isEmpty} from './underscoreIsObjectEmpty';

_.mixin({'deepExtend': deepExtend});
_.mixin({'compactObject': compactObject});
_.mixin({'isEmptyObject': isEmpty});