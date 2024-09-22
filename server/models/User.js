const db = require('../db');

class User {
    static create(login, password, fullName, email) {
        const query = `
            INSERT INTO users (login, password, full_name, email)
            VALUES (?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [login, password, fullName, email], (err, results) => {
                if (err) return reject(err);
                resolve(results.insertId);
            });
        });
    }

    static findByLogin(login) {
        const query = 'SELECT * FROM users WHERE login = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [login], (err, results) => {
                if (err) {
                    console.error('Database query error:', err);
                    return reject(err);
                }
                console.log('Query results:', results);
                resolve(results[0]);
            });
        });
    }

    static update(id, updates) {
        const query = `
            UPDATE users
            SET login = ?, password = ?, full_name = ?, email = ?
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [updates.login, updates.password, updates.fullName, updates.email, id], (err, results) => {
                if (err) return reject(err);
                resolve(results.affectedRows);
            });
        });
    }

    static delete(id) {
        const query = 'DELETE FROM users WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results.affectedRows);
            });
        });
    }
}

module.exports = User;
