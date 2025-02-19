import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BaseLLM } from "langchain/llms/base";
import { VectorStore } from "langchain/vectorstores/base";
import { Cohere } from "langchain/llms/cohere";

export const makeChain = (vectorstore: VectorStore, mode:string, initial_prompt: string)=> {
    const prompts = getInitialPromptByMode(mode, initial_prompt);
    let model: BaseLLM;
    if (process.env.COHERE_API_KEY){
        model = new Cohere();
    }
    else{
        model = new Cohere();
        console.log("Set cohere api key first")
    }

    let enableSourceDocs = false

    if (mode === "pair_programmer"){
        enableSourceDocs = true
    }
    return ConversationalRetrievalQAChain.fromLLM(model, vectorstore.asRetriever(), {
        qaTemplate: prompts.qa_prompt,
        questionGeneratorTemplate: prompts.condense_prompt,
        returnSourceDocuments: enableSourceDocs,
    },);
};

function getInitialPromptByMode(mode: string, initial_prompt: string) {
    // @todo we need to make this 100% dynamic, but there is a tradeoff between dynamic and easy to understand by end users. so will keep like this for now
    switch (mode) {
        case 'assistant':
            return {
                condense_prompt: `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`, qa_prompt: initial_prompt
            };
        case 'pair_programmer':
            return {
                condense_prompt: `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`, qa_prompt: `You are a helpful AI programmer. you will be given the content of git repository and your should answer questions about the code in the given context. 
You must answer with code when asked to write one, and you must answer with a markdown file when asked to write one, if the question is not about the code in the context, answer with "I only answer questions about the code in the given context".

{context}

Question: {question}
Helpful answer in markdown:`
            };
        default:
            return {
                condense_prompt: `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`, qa_prompt: initial_prompt
            };
    }
}