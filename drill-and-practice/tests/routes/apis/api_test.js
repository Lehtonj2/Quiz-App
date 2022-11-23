import { superoak } from "../../../deps.js";
import {app} from "../../../app.js";
import { executeQuery } from "../../../database/database.js";
import * as questionService from "../../../services/questionService.js";

Deno.test({
    name: "GET request to /api/questions/random should return {} if there are no questions. (Test requires that there are no questions)",
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/api/questions/random").expect({});
        },
        sanitizeResources: false,
        sanitizeOps: false,
});

Deno.test({
    name: "GET request to /api/questions/random should return {\"questionId\":1,\"questionText\":\"question\",\"questionOptions\":[{\"optionId\":1,\"optionText\":\"option\"}]}. (Test requires that these are the first question and option and a topic and user admin with id = 1 in the database)",
    async fn() {
        const testClient = await superoak(app);    await questionService.addquestion("1", "1", "question");
        const questionFromDatabase = await questionService.listTopicQuestions("1");
        const question = questionFromDatabase[0];
        const question_id = question.id;
    
        await questionService.addOption(question_id, "option", "TRUE");
        const optionFromDatabase = await questionService.listOptions(question_id);
        const option = optionFromDatabase[0];
        const option_id = option.id;
        
        
        await testClient.get("/api/questions/random").expect({"questionId":question_id,"questionText":"question","questionOptions":[{"optionId":option_id,"optionText":"option"}]});

        await executeQuery(
            "DELETE FROM question_answer_options WHERE id = ($option_id)", {option_id: option_id});
          await executeQuery(
              "DELETE FROM questions WHERE id = ($question_id)", {question_id: question_id});
        },
        sanitizeResources: false,
        sanitizeOps: false,
});