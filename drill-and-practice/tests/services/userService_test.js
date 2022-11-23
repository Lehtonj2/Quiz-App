import { assertEquals } from "../../deps.js";
import { addUser, findUserByEmail } from "../../services/userService.js";
import { executeQuery } from "../../database/database.js";

Deno.test({
  name: "Testing adding a user to database.",
  async fn() {
  await addUser("test@email.com", "12345");
  const userFromDatabase = await findUserByEmail("test@email.com");
  const user = await userFromDatabase[0];
  await executeQuery(
    "DELETE FROM users WHERE email = $email", {email: user.email});
  await assertEquals(user.email, "test@email.com");
  },
  sanitizeResources: false,
  sanitizeOps: false,
  });