This is a web application that is used for repeated practice of learned content. The application provides a list of topics and allows creating multiple-choice questions into those topics that are then answered by self and others. The application also shows basic statistics: the total number of available questions and the total number of question answers. In addition, the application also provides an API for retrieving and answering random questions.


To run the application in docker, go to or navigate to the drill-and-practice folder/directory and execute command "docker-compose up" in terminal or in command line application

command for running all tests in docker:
"docker-compose run --rm drill-and-practice deno test --allow-all"
test descriptions contain rules for running the tests.


By running the application trough docker, an admin user is automatically created.
admin user's credentials are:
email: admin@admin.com
password: 123456

Only admin user can add and remove topics in the application.
A user can be set as an admin in the database. database schema is in the end of this text-file

if you want to run the application through deno without docker, supply database credentials to database.js file to connection pool
const connectionPool = new Pool({
  hostname: "",
  database: "",
  user: "",
  password: "",
  port: "",
}, CONCURRENT_CONNECTIONS);
A database needs to be created manually for the application. Database schema is in the end of this text-file

command to run the application without docker (navigate to the drill-and-practice folder/directory):
"deno run --allow-net --allow-env --allow-read --unstable run-locally.js"

run tests when running locally outside docker
"deno test --allow-net --allow-env --allow-read --unstable"
test descriptions contain rules for running the tests.

request commands for using api:
curl http://localhost:7777/api/questions/random
curl -X POST -d '{\"questionId\": 5, \"optionId\": 10}' http://localhost:7777/api/questions/answer
questionId\": 5 and optionId\": 10 are examples.

The application provides an API that allows asking for a random question and for answering the random question. The API does not record the answers to the database.
GET requests made to the path /api/questions/random return a randomly selected question as a JSON document. The document has attributes questionId, questionText, and answerOptions. The attribute answerOptions is a list that contains answer options. Each answer option has attributes optionId and optionText. As an example, a document received as a response could look as follows:
{
  "questionId": 1,
  "questionText": "How much is 1+1?",
  "answerOptions": [
    { "optionId": 1, "optionText": "2" },
    { "optionId": 2, "optionText": "4" },
    { "optionId": 3, "optionText": "6" },
  ]
}
If there are no questions in the database, the returned document is empty, i.e. {}.
POST requests made to the path /api/questions/answer with a JSON document that contains the id of the question and the id of the answer option are processed by the server, verifying whether the response was correct or not. For example, the posted document could look as follows.
{
  "questionId": 1,
  "optionId": 3,
}

Database schema for the application:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  admin BOOLEAN DEFAULT FALSE,
  password CHAR(60)
);

CREATE TABLE topics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) UNIQUE
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  topic_id INTEGER REFERENCES topics(id),
  question_text TEXT NOT NULL
);

CREATE TABLE question_answer_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id),
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE
);

CREATE TABLE question_answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  question_id INTEGER REFERENCES questions(id),
  question_answer_option_id INTEGER REFERENCES question_answer_options(id)
);

CREATE UNIQUE INDEX ON users((lower(email)));

commands for creating an admin and first topic:

INSERT INTO users (email, password, admin)
  VALUES ('admin@admin.com','$2a$10$IML8QCf6xA.alRbW.CG5PuvYc3Qs94vJvoTwbsSehs8s515cUMuZa', true);

INSERT INTO topics (user_id, name)
  VALUES ((SELECT id FROM users WHERE email = 'admin@admin.com'), 'Finnish language');
