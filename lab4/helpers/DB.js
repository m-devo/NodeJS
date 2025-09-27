import mysql from "mysql2/promise";

const query = async (sql, params = []) => {
    try {
        const db = await mysql.createConnection({
            host: "localhost",
            user: "local",
            database: "node_db",
            password: "password",
        });

        const [results] = await db.execute(sql, params);
        
        return results;
    } catch (err) {
        console.log(err);
    }
};

export default query;