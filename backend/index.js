import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import controllers from "./src/controller/controller.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

app.post("/api/signup", controllers.signupController);

app.post("/api/login", controllers.loginController);

app.post("/api/set", controllers.createSetController);

app.get("/api/set/:setId", controllers.getSetController);

app.get("/api/sets/user/:user_id", controllers.getUserSetsController);

app.get("/api/questions/:setId", controllers.listQuestionsController);

app.patch("/api/set/:setId", controllers.updateSetController);

app.delete("/api/set/:setId", controllers.deleteSetController);

app.get("/api/sets/search", controllers.searchSetsController);

app.post("/api/questions", controllers.createQuestionController);
app.patch("/api/question/:questionId", controllers.updateQuestionController);
app.delete("/api/question/:questionId", controllers.deleteQuestionController);

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
