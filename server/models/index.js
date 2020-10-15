const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const db = {};

// Node와 MySql 연동
const sequelize = new Sequelize(
  config.dagabase,
  config.username,
  config.password,
  config
);

db.Comment = require("./comment")(sequelize, Sequelize);
db.User = require("./user")(sequelize, Sequelize);
db.Post = require("./post")(sequelize, Sequelize);
db.Image = require("./image")(sequelize, Sequelize);
db.Hashtag = require("./hashtag")(sequelize, Sequelize);

// 관계 연결
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
