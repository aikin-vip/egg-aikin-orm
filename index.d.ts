import {ConnectionOptions} from "typeorm/connection/ConnectionOptions";

declare module 'egg' {

    export interface EggAppConfig {
        orm: ConnectionOptions | ConnectionOptions[]
    }
}
