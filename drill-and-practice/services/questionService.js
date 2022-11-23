import { executeQuery } from "../database/database.js";

const addquestion = async (user_id, topic_id, question_text) => {
    await executeQuery("INSERT INTO questions (user_id, topic_id, question_text) VALUES ($user_id, $topic_id, $question_text);", {user_id: user_id, topic_id: topic_id, question_text: question_text});
  };

const listTopicQuestions = async (topic_id) => {
    const res = await executeQuery("SELECT * FROM questions WHERE topic_id = ($topic_id);", {topic_id: topic_id});
    return res.rows;
};

const getQuestion = async (id) => {
    const res = await executeQuery("SELECT * FROM questions WHERE id = ($id);", {id: id});
    return res.rows[0];
};

const getNumberOfQuestions = async () => {
    const res = await executeQuery("SELECT * FROM questions;");
    return res.rows.length;
};

const getRandomQuestion = async(tId) => {
    //chooses random question from given topic.
    const res = await executeQuery("SELECT * FROM questions WHERE topic_id = ($tId) ORDER BY RANDOM();", {tId: tId});
    if (res.rows.length === 0) {
        return null;
    } else {
        return res.rows[0];
    }
};

const getRandomQuestionWithOptions = async() => {
    //checks whether or not a random question has any positive answer options. This way the chosen question can be answered correctly.
    const res = await executeQuery("SELECT * FROM questions WHERE id IN (SELECT question_id FROM question_answer_options WHERE is_correct = TRUE) ORDER BY RANDOM();");

    if (res.rows.length === 0) {
        return null;
    } else {
        return res.rows[0];
    }
};

const addOption = async (question_id, option_text, is_correct) => {
    await executeQuery("INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES ($question_id, $option_text, $is_correct);", {question_id: question_id, option_text: option_text, is_correct: is_correct});
};

const listOptions = async (question_id) => {
    const res = await executeQuery("SELECT * FROM question_answer_options WHERE question_id = ($question_id);", {question_id: question_id});
    return res.rows;
};

const listQuizOptions = async (question_id) => { //lists question answer options if there are correct options available.
    const res1 = await executeQuery("SELECT * FROM question_answer_options WHERE (question_id = ($question_id) AND is_correct = TRUE);", {question_id: question_id});

    if (res1.rows.length === 0) {
        return res1.rows;
    } else {
        const res2 = await executeQuery("SELECT * FROM ((SELECT * FROM question_answer_options WHERE (question_id = ($question_id) AND is_correct = TRUE) ORDER BY RANDOM() LIMIT 1) UNION (SELECT * FROM question_answer_options WHERE (question_id = $question_id AND is_correct = FALSE) ORDER BY RANDOM() LIMIT 4)) t ORDER BY RANDOM();", {question_id: question_id});
        return res2.rows;
    }
};

const deleteOption = async (option_id) => {
    await executeQuery("DELETE FROM question_answers WHERE question_answer_option_id IN (SELECT (id) FROM question_answer_options WHERE id = $option_id);", {option_id: option_id});
    await executeQuery("DELETE FROM question_answer_options WHERE id = ($option_id);", {option_id: option_id});
};

const deleteQuestion = async (question_id) => {
    await executeQuery("DELETE FROM question_answers WHERE question_answer_option_id IN (SELECT (id) FROM question_answer_options WHERE question_id = ($question_id));", {question_id: question_id});
    await executeQuery("DELETE FROM question_answer_options WHERE question_id = ($question_id);", {question_id: question_id});
    await executeQuery("DELETE FROM questions WHERE id = ($question_id);", {question_id: question_id});
};

const getOption = async (option_id) => {
    const res = await executeQuery("SELECT * FROM question_answer_options WHERE id = ($option_id);", {option_id: option_id});
    if (res.rows.length === 0) {
        return null;
    } else {
        return res.rows[0];
    }
};

const addAnswer = async (user_id, question_id, question_answer_option_id) => {
    await executeQuery("INSERT INTO question_answers (user_id, question_id, question_answer_option_id) VALUES ($user_id, $question_id, $question_answer_option_id);", {user_id: user_id, question_id: question_id, question_answer_option_id: question_answer_option_id});
};

const getNumberOfAnswers = async () => {
    const res = await executeQuery("SELECT * FROM question_answers;");
    return res.rows.length;
};


export {addquestion, listTopicQuestions, getQuestion, getNumberOfQuestions, getRandomQuestion, getRandomQuestionWithOptions, addOption, listOptions, listQuizOptions, deleteOption, deleteQuestion, getOption, addAnswer, getNumberOfAnswers};