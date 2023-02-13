import haqqaton from "./haqqaton.json";

const isProd = process.env.NODE_ENV === "production";
const isLocal = process.env.NODE_ENV === "local";
const SERVER_URI = isProd ? haqqaton.server.prod : isLocal ? haqqaton.server.local : haqqaton.server.dev;

export {haqqaton, SERVER_URI};
