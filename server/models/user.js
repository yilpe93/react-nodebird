const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id => mysql에서 자동 생성
        email: {
          type: DataTypes.STRING(30),
          allowNull: false, // 필수
          unique: true, // 고유한 값
        },
        nickname: {
          type: DataTypes.STRING(30),
          allowNull: false, // 필수
        },
        password: {
          type: DataTypes.STRING(100), // 암호화를 위한
          allowNull: false, // 필수
        },
      },
      {
        charset: "utf8",
        collate: "utf8_general_ci", // 한글 저장
        sequelize,
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId", // 먼저 찾아야하는 Key 설정
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define(
//     "User",
//     {
//       // id => mysql에서 자동 생성
//       email: {
//         type: DataTypes.STRING(30),
//         allowNull: false, // 필수
//         unique: true, // 고유한 값
//       },
//       nickname: {
//         type: DataTypes.STRING(30),
//         allowNull: false, // 필수
//       },
//       password: {
//         type: DataTypes.STRING(100), // 암호화를 위한
//         allowNull: false, // 필수
//       },
//     },
//     {
//       charset: "utf8",
//       collate: "utf8_general_ci", // 한글 저장
//     }
//   );

//   User.associate = (db) => {
//     db.User.hasMany(db.Post);
//     db.User.hasMany(db.Comment);
//     db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
//     db.User.belongsToMany(db.User, {
//       through: "Follow",
//       as: "Followers",
//       foreignKey: "FollowingId", // 먼저 찾아야하는 Key 설정
//     });
//     db.User.belongsToMany(db.User, {
//       through: "Follow",
//       as: "Followings",
//       foreignKey: "FollowerId",
//     });
//   };

//   return User;
// };
