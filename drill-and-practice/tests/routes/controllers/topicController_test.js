import { superoak } from "../../../deps.js";
import {app} from "../../../app.js";

Deno.test({
    name: "GET request to /topics should return 302",
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/topics").expect(302);
        },
        sanitizeResources: false,
        sanitizeOps: false,
});