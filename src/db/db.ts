import { Sequelize } from "sequelize";

const val2 = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@db:5432/${process.env.PGDATABASE}`;

const sequelize = new Sequelize(val2, {
  dialect: "postgres",
});
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    throw error;
  }
};

export { sequelize, testDbConnection };
