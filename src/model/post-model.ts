import { sequelize as sq } from "../db/db";
import { DataTypes, Model } from "sequelize";

class Post extends Model {
  declare author: number;
  declare title: string;
  declare content: string;
  declare id: number;
}

Post.init(
  {
    author: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sq,
    modelName: "Post",
    timestamps: true,
    freezeTableName: true,
    tableName: "Post",
  }
);

sq.sync({ alter: true })
  .then(() => {
    console.log("Post table created successfully!");
  })
  .catch((error: any) => {
    console.log(error);
    console.error("Unable to create table : ", error);
  });

export default Post;
