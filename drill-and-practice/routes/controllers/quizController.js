import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";

const showQuiz = async ({ render }) => {
    render("quiz.eta", {topics: await topicService.listTopicsAlphabetic()});
};

const showRandomQuestion = async ({params, state, render }) => {
    const question = await questionService.getRandomQuestion(params.tId);
    if (question) {
        const quiz_options = await questionService.listQuizOptions(question.id);
        for (const element of quiz_options) {
            if (element.is_correct) {
                await state.session.set("correct_answer_text", element.option_text);
            }
        }
;
        render("quizQuestion.eta", {question: question, options: quiz_options});
    } else {
        render("quizQuestion.eta");
    }
};

const addAnswer = async ({params, state, response}) => {
    const user = await state.session.get("user");
    await questionService.addAnswer(user.id, params.qId, params.oId);
    const option = await questionService.getOption(params.oId);
    await state.session.set("last_tId", params.tId);
    if (option.is_correct) {
        response.redirect(`/quiz/${params.tId}/questions/${params.qId}/correct`);
    } else {
        response.redirect(`/quiz/${params.tId}/questions/${params.qId}/incorrect`);
    }
};

const showCorrect = async ({render, state}) => {
    render("answer.eta", {is_correct: "Correct!", topic_id: await state.session.get("last_tId")});
};

const showIncorrect = async ({render, state}) => {
    render("answer.eta", {is_correct: "Incorrect!", correct_text: await state.session.get("correct_answer_text"), topic_id: await state.session.get("last_tId")});
};

export { showQuiz, showRandomQuestion, addAnswer, showCorrect, showIncorrect};