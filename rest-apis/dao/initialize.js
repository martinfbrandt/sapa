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

const createExperiencesTable = 'CREATE TABLE IF NOT EXISTS experiences ( id INTEGER PRIMARY KEY, description TEXT NOT NULL, location TEXT NOT NULL, created_dt  TEXT NOT NULL, name TEXT NOT NULL, owner_id INTEGER NOT NULL, CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE );';

const createExperienceUserBridgeTable = 'CREATE TABLE IF NOT EXISTS experience_user_bt (id INTEGER PRIMARY KEY, user_id INTEGER, experience_id INTEGER, CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT fk_experience FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE);';

const createWishlistTable = 'CREATE TABLE IF NOT EXISTS wishlist (id INTEGER PRIMARY KEY, location TEXT, description TEXT);';
const createWishlistItemTable = 'CREATE TABLE IF NOT EXISTS wishlist_item (id INTEGER PRIMARY KEY, experience_id INTEGER, wishlist_id INTEGER, CONSTRAINT fk_experience FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE), CONSTRAINT fk_wishlist FOREIGN KEY (wishlist_id) REFERENCES wishlist(id) ON DELETE CASCADE);';
const createUserWishlistBridgeTable = 'CREATE TABLE IF NOT EXISTS wishlist_user_bt (id INTEGER PRIMARY KEY, user_id INTEGER, wishlist_id INTEGER, CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT fk_wishlist FOREIGN KEY (wishlist_id) REFERENCES wishlist(id) ON DELETE CASCADE);';

const createCalendarTable = 'CREATE TABLE IF NOT EXISTS calendar (id INTEGER PRIMARY KEY);';
const createCalendarItemTable = 'CREATE TABLE IF NOT EXISTS calendar_item (id INTEGER PRIMARY KEY, experience_id INTEGER, calendar_id INTEGER, added_dt TEXT NOT NULL, scheduled_dt TEXT NOT NULL, CONSTRAINT fk_experience FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE), CONSTRAINT fk_calendar FOREIGN KEY (calendar_id) REFERENCES calendar(id) ON DELETE CASCADE);'
const createUserCalendarBridgeTable = 'CREATE TABLE IF NOT EXISTS calendar_user_bt (id INTEGER PRIMARY KEY, user_id INTEGER, calendar_id INTEGER, CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT fk_calendar FOREIGN KEY (calendar_id) REFERENCES calendar(id) ON DELETE CASCADE);';


const deleteAdminUserRoles = `DELETE FROM user_roles where user_id = (SELECT id from users where email = '${adminEmail}')`
const deleteAdminUser = `DELETE FROM users where email = '${adminEmail}'`;

const createAdminUser = pass => `INSERT INTO users (name, email, password_hash) VALUES ("admin", '${adminEmail}', "${pass}")`
const createAdminRole = `INSERT INTO user_roles (key, user_id) VALUES('admin', (SELECT id from users where email = '${adminEmail}'))`

const initializeDB = async () => {
    let db = new sqlite3.Database('/Users/martinbrandt/sqldb/sqlite.db');
    db.run(createUserTable);
    db.run(createUserRolesTable);
    db.run(createExperiencesTable);
    db.run(createExperienceUserBridgeTable);
    db.run(createWishlistTable);
    db.run(createWishlistItemTable);
    db.run(createUserWishlistBridgeTable);
    db.run(createCalendarTable);
    db.run(createCalendarItemTable);
    db.run(createUserCalendarBridgeTable);
    db.run(deleteAdminUserRoles);
    db.run(deleteAdminUser);
    db.run(createAdminUser(await adminPassHash()));
    db.run(createAdminRole)
    db.close();
};

module.exports = initializeDB;  