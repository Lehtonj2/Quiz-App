import { bcrypt } from "../../deps.js";
import * as userService from "../../services/userService.js";
import { validasaur } from "../../deps.js";

const validationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
};

const registerUser = async ({ render, request, response }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;

    const userData = {
      email: params.get("email"),
      password: params.get("password"),
    };
    let [passes, errors] = await validasaur.validate(
      userData,
      validationRules,
    );
    const existingUser = await userService.findUserByEmail(params.get("email"));
    if (existingUser.length > 0) {
      errors["email"] = {available: "email is already taken"};
      passes = false;
    }

    if (!passes) {
      console.log(errors);
      render("registration.eta", {validationErrors: errors});
    } else {
      await userService.addUser(
        params.get("email"),
        await bcrypt.hash(params.get("password")),
      );
      response.redirect("/auth/login");
    }
  };
  
  const showRegistrationForm = ({ render }) => {
    render("registration.eta");
  };
  
  export { registerUser, showRegistrationForm };