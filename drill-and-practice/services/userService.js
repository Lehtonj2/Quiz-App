import { executeQuery } from "../database/database.js";

const addUser = async (email, password) => {
  await executeQuery(
    `INSERT INTO users
      (email, admin, password)
        VALUES ($email, FALSE, $password)`, {
          email: email,
          password: password
        }
  );
};

const findUserByEmail = async (email) => {
    const result = await executeQuery(
      "SELECT * FROM users WHERE email = $email",
      {email: email},
    );
  
    return result.rows;
  };

export { addUser, findUserByEmail };