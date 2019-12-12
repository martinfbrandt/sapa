var sqlite3 = require('sqlite3').verbose()
const {hashPassword} = require('./passwords');
const {prop} = require('ramda');

const adminEmail = "admin@sapa.com";

const adminPassHash = async () => {
    const user = await hashPassword({"password": 'admin'})
    return prop('password', user);
}

const createUserTable = 'CREATE TABLE IF NOT EXISTS users (id integer PRIMARY KEY, name text NOT NULL, email text NOT NULL, password_hash text NOT NULL, CONSTRAINT unique_email UNIQUE (email));';

const createUserRolesTable = 'CREATE TABLE IF NOT EXISTS user_roles (key text, user_id integer NOT NULL, PRIMARY KEY(key, user_id), CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);'

const createExperiencesTable = 'CREATE TABLE IF NOT EXISTS experiences (id integer PRIMARY KEY, description text NOT NULL, created_dt text NOT NULL, name text NOT NULL, user_id integer NOT NULL, CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);';

const deleteAdminUserRoles = `DELETE FROM user_roles where user_id = (SELECT id from users where email = '${adminEmail}')`
const deleteAdminUser = `DELETE FROM users where email = '${adminEmail}'`;

const createAdminUser = pass => `INSERT INTO users (name, email, password_hash) VALUES ("admin", '${adminEmail}', "${pass}")`
const createAdminRole = `INSERT INTO user_roles (key, user_id) VALUES('admin', (SELECT id from users where email = '${adminEmail}'))`

const initializeDB = async () => {
    let db = new sqlite3.Database('/Users/martinbrandt/sqldb/sqlite.db');
    db.run(createUserTable);
    db.run(createUserRolesTable);
    db.run(createExperiencesTable);
    db.run(deleteAdminUserRoles);
    db.run(deleteAdminUser);
    db.run(createAdminUser(await adminPassHash()));
    db.run(createAdminRole)
    db.close();
};

module.exports = initializeDB;  