var sqlite3 = require('sqlite3').verbose()

var dbconfig = require('./dbconfig.json');

class Database {
    constructor(){
      this.db = new sqlite3.Database(dbconfig.path)
    }

    runQuery(query, params) {
        return new Promise((res, rej) => {
            this.db.all(query, params, (err, rows) => {
                if(err){
                  rej(err);
                }
                res(rows);
            })
        })
    }

    close() {
        return new Promise((res, rej) => {
            this.db.close(err => {
                if(err) {
                  rej(err);
                }
                res();
            });
        })
    }
}

module.exports.Database = Database;
