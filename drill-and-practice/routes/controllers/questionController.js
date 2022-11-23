import * as questionService from "../../services/questionService.js";
import * as topicService from "../../services/topicService.js";
import { validasaur } from "../../deps.js";

const validationRules = {
  text: [validasaur.required, validasaur.minLength(1)],
};

const addquestion = async ({params, render, request, response, state }) => {
    const body = request.body({ type: "form" });
    const request_params = await body.value;
    const user = await state.session.get("user");
    const questionData = {
      text: request_params.get("question_text"),
    };
    const [passes, errors] = await validasaur.validate(
      questionData,
      validationRules,
    );
    if (!passes) {
      console.log(errors);
      render("topic.eta", {topic: await topicService.getTopic(params.id), questions: await questionService.listTopicQuestions(params.id), validationErrors: errors});
    } else {
      await questionService.addquestion(user.id, params.id, request_params.get("question_text")); 
      response.redirect(`/topics/${params.id}`);
    }
};

const showQuestion = async ({params, render}) => {
  render("question.eta", {question: await questionService.getQuestion(params.qId), options: await questionService.listOptions(params.qId)});
};

const addOption = async({params, render, request, response}) => {
  const body = request.body({ type: "form" });
  const request_params = await body.value;
  let is_correct = request_params.get("is_correct");
  if (is_correct) {
    is_correct = "TRUE";
  } else {
    is_correct = "FALSE";
  }
  const optionData = {
    text: request_params.get("option_text"),
  };
  const [passes, errors] = await validasaur.validate(
    optionData,
    validationRules,
  );
  if (!passes) {
    console.log(errors);
    render("question.eta", {question: await questionService.getQuestion(params.qId), options: await questionService.listOptions(params.qId), validationErrors: errors});
  } else {
    await questionService.addOption(params.qId, request_params.get("option_text"), is_correct);
    response.redirect(`/topics/${params.id}/questions/${params.qId}`);
  }
};

const removeOption = async ({params, response}) => {
  await questionService.deleteOption(params.oId);

  response.redirect(`/topics/${params.id}/questions/${params.qId}`);
};

const removeQuestion = async ({params, response}) => {
  await questionService.deleteQuestion(params.qId);

  response.redirect(`/topics/${params.id}`);
};

export {addquestion, showQuestion, addOption, removeOption, removeQuestion};

