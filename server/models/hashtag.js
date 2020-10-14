module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    "Hashtag",
    {
      content: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8_general_ci", // 한글 + 이모티콘 저장
    }
  );

  Hashtag.associate = (db) => {};
  return Hashtag;
};
