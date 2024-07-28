const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.sqlite');

function createTable() {
  return new Promise((resolve, reject) => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE
    )`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function createUser(name, email) {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

function getUser(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function updateUser(id, name, email) {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [name, email, id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

function deleteUser(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

async function main() {
  try {
    await createTable();
    console.log('Table created or already exists');

    const userId = await createUser('John Doe', 'john@example.com');
    console.log(`Created user with ID: ${userId}`);

    const user = await getUser(userId);
    console.log('Read user:', user);

    const updatedRows = await updateUser(userId, 'John Updated', 'john.updated@example.com');
    console.log(`Updated ${updatedRows} row(s)`);

    const updatedUser = await getUser(userId);
    console.log('Updated user:', updatedUser);

    const deletedRows = await deleteUser(userId);
    console.log(`Deleted ${deletedRows} row(s)`);

    const deletedUser = await getUser(userId);
    console.log('Deleted user:', deletedUser); // Should be undefined

  } catch (error) {
    console.error('Error:', error);
  } finally {
    db.close();
  }
}

main();