import { executeQuery } from "../database/database.js";

const addTopic = async (user_id, name) => {
  await executeQuery("INSERT INTO topics (user_id, name) VALUES ($user_id, $name);", {user_id: user_id, name: name});
};

const deleteTopic = async (id) => {
  await executeQuery("DELETE FROM question_answers WHERE question_answer_option_id IN (SELECT (id) FROM question_answer_options WHERE question_id IN (SELECT (id) FROM questions WHERE topic_id = $id));", {id: id});
  await executeQuery("DELETE FROM question_answer_options WHERE question_id IN (SELECT (id) FROM questions WHERE topic_id = $id);", {id: id});
  await executeQuery("DELETE FROM questions WHERE topic_id = $id;", {id: id});
    
  await executeQuery("DELETE FROM topics WHERE id = $id", {id: id});
};

const listTopics = async () => {
  const res = await executeQuery("SELECT * FROM topics;");

  return res.rows;
};

const listTopicsAlphabetic = async () => {
  const res = await executeQuery("SELECT * FROM topics ORDER BY name;");

  return res.rows;
};

const getTopic = async (id) => {
  const res = await executeQuery("SELECT * FROM topics WHERE id = ($id);", {id: id});
  return res.rows[0];
}

const findTopicByName = async (name) => {
  const result = await executeQuery(
    "SELECT * FROM topics WHERE name = $name",
    {name: name}
  );

  return result.rows;
};

const getNumberOfTopics = async () => {
  const res = await executeQuery("SELECT * FROM topics;");
  return res.rows.length;
};
  
  export { addTopic, deleteTopic, listTopics, listTopicsAlphabetic, getTopic, findTopicByName, getNumberOfTopics };