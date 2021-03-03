import mysql, { Connection, FieldInfo, MysqlError, QueryOptions } from "mysql";
import dbDetails from "../config/database";
import Logs, { LogLevels } from "../util/Logs";

export default class SQLConnection {
    protected mysql: Connection;

    constructor() {
        this.mysql = mysql.createConnection(dbDetails);
        this.mysql.connect();
    }

    executeSqlQuery(query: string | QueryOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            this.mysql.query(
                query,
                (error: MysqlError, results: any, fields: FieldInfo[]) => {
                    if (error) {
                        Logs.addLog(error.message, LogLevels.ERROR);
                        reject(error.message);
                    }
                    resolve(results);
                }
            );
        });
    }

    close() {
        this.mysql.end((err: MysqlError | undefined) => {
            if (err) {
                Logs.addLog(err.message, LogLevels.ERROR);
            }
        });
    }
}
