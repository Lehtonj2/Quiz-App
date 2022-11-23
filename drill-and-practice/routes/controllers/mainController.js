import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";

const showMain = async ({ render }) => {
  render("main.eta", {nOfQuestions: await questionService.getNumberOfQuestions(), nOfAnswers: await questionService.getNumberOfAnswers(), nOfTopics: await topicService.getNumberOfTopics()});
};

export { showMain };
