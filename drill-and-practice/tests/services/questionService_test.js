import { assertEquals } from "../../deps.js";
import * as questionService from "../../services/questionService.js";
import { executeQuery } from "../../database/database.js";

Deno.test({
    name: "Testing adding a question to database and reading it from database. Requires userId 1 and topicId 1 to exists and no other questions in the topic.",
    async fn() {
    await questionService.addquestion("1", "1", "Test");
    const questionFromDatabase = await questionService.listTopicQuestions("1");
    const question = questionFromDatabase[0];
    const question_id = question.id;

    await executeQuery(
      "DELETE FROM questions WHERE id = ($question_id)", {question_id: question_id});
    await assertEquals(question.question_text, "Test");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "Testing adding 3 questions to database and checking if there are 3 more in database after addition. Requires userId 1 and topicId 1 to exists and no other questions in the topic.",
    async fn() {
    const nOfquestions1 = await questionService.getNumberOfQuestions();
    await questionService.addquestion("1", "1", "Test1");
    await questionService.addquestion("1", "1", "Test2");
    await questionService.addquestion("1", "1", "Test3");
    const nOfquestions2 = await questionService.getNumberOfQuestions();
    await executeQuery(
        "DELETE FROM questions WHERE topic_id = ($topic_id)", {topic_id: "1"});
    
    await assertEquals(nOfquestions2 - nOfquestions1, 3);
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test({
    name: "Testing adding a option to database and reading it from database. Requires userId 1 and topicId 1 to exists and no questions in the topic.",
    async fn() {
    await questionService.addquestion("1", "1", "Test");
    const questionFromDatabase = await questionService.listTopicQuestions("1");
    const question = questionFromDatabase[0];
    const question_id = question.id;

    await questionService.addOption(question_id, "Test", "TRUE");
    const optionFromDatabase = await questionService.listOptions(question_id);
    const option = optionFromDatabase[0];
    const option_id = option.id;
    

    await executeQuery(
      "DELETE FROM question_answer_options WHERE id = ($option_id)", {option_id: option_id});
    await executeQuery(
        "DELETE FROM questions WHERE id = ($question_id)", {question_id: question_id});
    await assertEquals(option.option_text, "Test");
    },
    sanitizeResources: false,
    sanitizeOps: false,
    });
