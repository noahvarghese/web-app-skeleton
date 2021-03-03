import dotenv from "dotenv";
import dbConnection from "../types/db-connection";

dotenv.config();

const sqlConnectionDetails: dbConnection = {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PWD!,
    database: process.env.DB_NAME!,
};

export default sqlConnectionDetails;
