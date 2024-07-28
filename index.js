const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./chinook.db')

prepare();

setInterval(() => { }, 5e6);

function prepare() {
  String.prototype.run = function (cb) {
    db.all(this.toString(), (err, result) => {
      if (err) throw err;
      if (cb) result = cb(result)
      console.log(result);
    })
  }
}