import { assertEquals } from "../../deps.js";
import * as topicService from "../../services/topicService.js";
import { executeQuery } from "../../database/database.js";

Deno.test({
    name: "Testing adding a topic to database and reading it from database.",
    async fn() {
    await topicService.addTopic("1", "Test");
    const topicFromDatabase = await topicService.findTopicByName("Test");
    const topic = await topicFromDatabase[0];
    await executeQuery(
      "DELETE FROM topics WHERE user_id = ($user_id) AND name = ($name)", {user_id: "1", name: "Test"});
    await assertEquals(topic.name, "Test");
    },
    sanitizeResources: false,
    sanitizeOps: false,
    });

Deno.test({
    name: "Testing adding 3 topics to database and checking if there are 3 more in database after addition.",
    async fn() {
    const nOfTopics1 = await topicService.getNumberOfTopics();
    await topicService.addTopic("1", "Test1");
    await topicService.addTopic("1", "Test2");
    await topicService.addTopic("1", "Test3");
    const nOfTopics2 = await topicService.getNumberOfTopics();
    await executeQuery(
        "DELETE FROM topics WHERE user_id = ($user_id) AND name = ($name)", {user_id: "1", name: "Test1"});
        await executeQuery(
            "DELETE FROM topics WHERE user_id = ($user_id) AND name = ($name)", {user_id: "1", name: "Test2"});
            await executeQuery(
                "DELETE FROM topics WHERE user_id = ($user_id) AND name = ($name)", {user_id: "1", name: "Test3"});
    await assertEquals(nOfTopics2 - nOfTopics1, 3);
    },
    sanitizeResources: false,
    sanitizeOps: false,
    });
