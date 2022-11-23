import * as questionService from "../../services/questionService.js";

const handleAnswer = async ({request, response}) => {
    const body = request.body({ type: "json" });
    const content = await body.value;
    if (content.questionId && content.optionId) {
        const option = await questionService.getOption(content.optionId);

        if (option && option.question_id === content.questionId) {
            response.body = {correct: option.is_correct};
        } else {
            response.body = {};
        }
    } else {
        response.body = {};
    }

};
//curl -X POST -d '{\"questionId\": 5, \"optionId\": 10}' http://localhost:7777/api/questions/answer

const serveRandomQuestion = async ({response}) => {
    const question = await questionService.getRandomQuestionWithOptions();
    if (question) {
        const data = {
            questionId: question.id,
            questionText: question.question_text,
            questionOptions: [],
        };
        const options = await questionService.listOptions(question.id);
        for (const option of options) {
            data.questionOptions.push({optionId: option.id, optionText: option.option_text});
        }

        response.body = data;
    } else {
        response.body = {};
    }
};

export { serveRandomQuestion, handleAnswer };