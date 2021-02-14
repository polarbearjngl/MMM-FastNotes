const NodeHelper = require("node_helper");
var pyshell = require('python-shell');
const sqlite3 = require('sqlite3');

module.exports = NodeHelper.create({

  socketNotificationReceived: function (notification, payload) {
    if (notification === "START_FAST_NOTES") {
      this.config = payload;
      this.todoListStart();
      setInterval(() => {
        this.readDb();
      }, this.config.updateInterval);
    }
  },

  todoListStart: function () {
    self = this;
    var options = {
      pythonPath: this.config.pythonPath,
      scriptPath: './modules/MMM-FastNotes',
      args: [
        "--host", this.config.host,
        "--port", this.config.port
      ]
    };

    pyshell.PythonShell.run('FastNotes.py', options, function (err) {
      if (err) throw err;
    });
  },

  readDb: function () {
    let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      }
    });

    let sql = `SELECT title Title,
                      content Text,
                      created Date
               FROM posts
               ORDER BY created`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      this.sendSocketNotification("DATABASE", rows);
    });

    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
    });
  },
});