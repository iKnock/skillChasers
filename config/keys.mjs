//export * from "./dev.mjs";

import * as devConfig from './dev.mjs';
import * as prodConfig from './prod.mjs';

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;


export { config };