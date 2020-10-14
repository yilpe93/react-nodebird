module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
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
    }
  );

  User.associate = (db) => {};
  return User;
};
