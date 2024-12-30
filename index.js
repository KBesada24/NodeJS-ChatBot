import client from "./config/openai.js";
import readlineSync from "readline-sync";
import colors from "colors";

async function main() {
  console.log(colors.green("Welcome to my ChatGPT bot!"));

  const chatHistory = [];

  while (true) {
    const input = readlineSync.question(colors.yellow("You: "));
    const messages = chatHistory.map(([role, content]) => ({ role, content }));
    try {
      messages.push({ role: "user", content: input });
      const chatCompletion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        store: true,
        messages: messages,
      });

      completion = chatCompletion.data.choices[0].message.content;
      if (input.toLowerCase() === "exit") {
        console.log(colors.green("ChatGPT: ") + completion);
        return;
      }
      chatHistory.push(["user", input]);
      chatHistory.push(["assistant", completion]);
    } catch (error) {
      if (error.response?.status === 429) {
        console.error("Quota exceeded. Please check your plan and billing.");
      } else {
        console.error("An error occurred:", error.message);
      }
    }
  }
}

main();
