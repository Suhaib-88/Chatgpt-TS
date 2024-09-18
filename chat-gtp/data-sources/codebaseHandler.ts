import type { NextApiRequest, NextApiResponse } from "next";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CohereEmbeddings } from "langchain/embeddings/cohere";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { initVectorStore } from "@/utils/initVectorStore";
import { warn } from "console";

export default async function codebaseHandler(req:NextApiRequest, res: NextApiResponse) {
    try{
        const {repo, namespace} = req.body;
        const repoLoader = new GithubRepoLoader(repo, 
            {branch: "main", recursive: true, unknown: "warn",}
        );
        const rawDocs= await repoLoader.load();
        console.log('Loaded docs')
        
        const textSplitter= new RecursiveCharacterTextSplitter({
            chunkSize:1000, chunkOverlap:200
        });
        const docs = textSplitter.splitDocuments(rawDocs);
        console.log("Splitting docs")

        const embeddings= new CohereEmbeddings();
        await initVectorStore(docs, embeddings, {namespace})
        console.log("Indexed documents. All done!")
        return res.status(200).json({message: "Success"});
        } catch (e: any) {
            console.error(e);
            return res.status(500).json({error: e.message})

    }
    
}

