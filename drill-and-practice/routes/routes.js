import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as questionController from "./controllers/questionController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as quizController from "./controllers/quizController.js";
import * as api from "./apis/api.js";

const router = new Router();

router.get("/", mainController.showMain);
router.get("/topics/:id", topicController.showTopic);
router.get("/topics", topicController.showTopics);
router.get("/topics/:id/questions/:qId", questionController.showQuestion);
router.get("/quiz", quizController.showQuiz);
router.get("/quiz/:tId", quizController.showRandomQuestion);
router.get("/quiz/:tId/questions/:qId/correct", quizController.showCorrect);
router.get("/quiz/:tId/questions/:qId/incorrect", quizController.showIncorrect);

router.post("/topics", topicController.addTopic);
router.post("/topics/:id", topicController.removeTopic);
router.post("/topics/:id/questions", questionController.addquestion);
router.post("/topics/:id/questions/:qId/options", questionController.addOption);
router.post("/topics/:id/questions/:qId/delete", questionController.removeQuestion);
router.post("/topics/:id/questions/:qId/options/:oId/delete", questionController.removeOption);
router.post("/quiz/:tId/questions/:qId/options/:oId", quizController.addAnswer);


router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);

router.get("/api/questions/random", api.serveRandomQuestion);
router.post("/api/questions/answer", api.handleAnswer);

export { router };
