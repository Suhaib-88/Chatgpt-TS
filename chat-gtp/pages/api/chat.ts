import { getVectorStore } from "@/utils/getVectorStore"
import {makeChain} from "@/utils/makechain";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
    const {question, history, namespace, mode, initial_prompt} = req.body;
    console.log({question, history, namespace, mode, initial_prompt});
    if (req.method!=="POST"){
        return res.status(405).json({error: "Method not allowed"})
    }
    if (!question){
        return res.status(400).json({error: "Question is required"})
    }
    const sanitizedQuestion = question.trim().replaceAll("\n", ' ')
    try{
        const vectorStore = await getVectorStore(namespace);
        const chain = makeChain(vectorStore, mode, initial_prompt);
        const response = await chain.call({
            question: sanitizedQuestion, chat_history: history?.join('\n') || [],
        });
        console.log("Here is the response", response)
        return res.status(200).json(response)

    }
    catch(error:any){
        console.error(error)
        return res.status(500).json({error: error.message || 'Something went wrong'})
    }
}