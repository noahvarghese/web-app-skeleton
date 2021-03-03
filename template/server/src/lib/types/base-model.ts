import { Connection } from "mysql";
import SQLConnection from "../database/sql-connection";

export default interface BaseModel {
    connection: SQLConnection;
    create: () => Promise<boolean>;
    read: () => Promise<any[] | any>;
    update: () => Promise<boolean>;
    delete: () => Promise<boolean>;
}
