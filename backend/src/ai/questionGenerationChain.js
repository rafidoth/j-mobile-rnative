import { ChatGroq } from "@langchain/groq";
import { LlmExpectedResponseSchema } from "./schema.js";

const getQuestionGenerationAgent = async () => {
  const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });

  const agent = model.withStructuredOutput(LlmExpectedResponseSchema, {
    name: "generate_questions",
    strict: true,
  });
  
  return agent;
};

export default getQuestionGenerationAgent;
