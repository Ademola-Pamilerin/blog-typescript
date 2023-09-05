import { sequelize as sq } from "../db/db";
import { DataTypes, Model } from "sequelize";

class User extends Model {
  declare id: number;
  declare email: string;
  declare password: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sq,
    modelName: "Users",
    timestamps: true,
    freezeTableName: true,
    tableName: "Users",
  }
);

sq.sync()
  .then(() => {
    console.log("Users table created successfully!");
  })
  .catch((error: any) => {
    console.error("Unable to create table : ", error);
  });

export default User;
