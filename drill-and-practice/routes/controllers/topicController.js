import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";

const topicValidationRules = {
  name: [validasaur.required, validasaur.minLength(1)],
};


const showTopics = async ({state, render }) => {
    const user = await state.session.get("user");
    render("topics.eta", {topics: await topicService.listTopics(), admin: user.admin});
  };

const showTopic = async ({params, render}) => {
  render("topic.eta", {topic: await topicService.getTopic(params.id), questions: await questionService.listTopicQuestions(params.id)});
};

const addTopic = async ({ state, render, request, response }) => {
    const body = request.body({ type: "form" });
    const params = await body.value;
    const user = await state.session.get("user");
    const topicData = {
      name: params.get("topic_name")
    };
    if (user && user.admin) {
      let [passes, errors] = await validasaur.validate(
        topicData,
        topicValidationRules,
      );
      const existingTopic = await topicService.findTopicByName(topicData.name);
      if (existingTopic.length > 0) {
        errors["name"] = {available: "name is already taken"};
        passes = false;
      }

      if (!passes) {
        console.log(errors);
        render("topics.eta", {topics: await topicService.listTopics(), admin: user.admin, validationErrors: errors});
      } else {
      await topicService.addTopic(user.id, topicData.name);
      response.redirect("/topics");
      }
    } else {
      response.redirect("/topics");
    }

};

const removeTopic = async ({state, params, response}) => {
  const user = await state.session.get("user");
  if (user && user.admin) {
    await topicService.deleteTopic(params.id);
  }

  response.redirect("/topics");
};


  export { showTopics, addTopic, showTopic, removeTopic };