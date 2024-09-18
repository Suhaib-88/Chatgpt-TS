import { CustomPDFLoader } from "@/utils/customPDFLoader";
import { initVectorStore } from "@/utils/initVectorStore";
import { error } from "console";
import { Dir } from "fs";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { CohereEmbeddings } from "langchain/embeddings/cohere";
import { RecursiveCharacterTextSplitter, TextSplitter } from "langchain/text_splitter";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function  pdfHandler(req:NextApiRequest, res: NextApiResponse) {
    try{
        const {shared_folder} = req.body;
        const namespace= req.body.namespace;
        const directoryLoader = new DirectoryLoader("/app/shared_data/" + shared_folder, {'.pdf': (path:string|Blob)=> new CustomPDFLoader(path)})
        const rawDocs= await directoryLoader.load();
        const textSplitter= new RecursiveCharacterTextSplitter({chunkSize:1000, chunkOverlap:200,});
        const docs= textSplitter.splitDocuments(rawDocs);
        const embeddings = new CohereEmbeddings();
        await initVectorStore(docs,embeddings, {namespace});
        console.log("All is done, folder deleted")

        return res.status(200).json({message: "success"});
    }
    catch(e:any){
        console.error(e);
        return res.status(500).json({error:e.message})
    }
    
}
