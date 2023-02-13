import localConfig from "./ormconfig.local.json";
import devConfig from "./ormconfig.dev.json";
import prodConfig from "./ormconfig.prod.json";
const isProd = process.env.NODE_ENV === "production";
const isLocal = process.env.NODE_ENV === "local";

export default isProd ? prodConfig : isLocal ? localConfig : devConfig;
