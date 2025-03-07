import "dotenv/config";
import initKnex from "knex";
import configuration from "../knexfile.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const knex = initKnex(configuration);
const SALT_ROUNDS = 8;

const getUser = async (req, res) => {
  try {
    const user = await knex("users").where({ id: req.user_id }).first();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Can't fetch user profile" });
  }
};
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await knex("users").where("email", email).first();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("[ERROR] GET user by email:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const registerUser = async (req, res) => {
  if (
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.username ||
    !req.body.email ||
    !req.body.password
  ) {
    return res
      .status(400)
      .json({ msg: "You must provide all required information" });
  }

  try {
    // Use bcrypt to hash the password the user provided
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);

    const newUserIds = await knex("users").insert({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const newUser = await knex("users").where({ email: req.body.email }).first();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ msg: `Couldn't create new user: ${error.message}` });
    console.log(error)
  }
};

const loginUser = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "You must provide an email and password" });
  }

  try {
    const user = await knex("users").where({ email: req.body.email }).first();

    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result) {
      return res
        .status(403)
        .json({ message: "Username/Password combination is incorrect" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        sub: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ authToken: token });
  } catch (error) {
    res.status(404).json({ message: `User not found${error}` });
  }
};

export { getUser, registerUser, loginUser };
