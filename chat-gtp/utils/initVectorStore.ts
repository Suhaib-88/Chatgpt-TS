import Document from "next/document";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { QdrantVectorStore } from "langchain/vectorstores/qdrant";
import { PINECONE_TEXT_KEY, VECTOR_STORE_INDEX_NAME } from "@/config/pinecone";
import {StoreOptions} from "@/interfaces/storeOptions.interface";
import { StoreType } from "./store.enum"
import { CohereEmbeddings } from "langchain/embeddings/cohere";

export async function initVectorStore(docs: any, embeddings: CohereEmbeddings, options: StoreOptions) {
    switch(process.env.STORE){
        case StoreType.PINECONE: const {pinecone} = await import ('./pinecone-client');
        await PineconeStore.fromDocuments(docs, embeddings,{
            pineconeIndex: (await pinecone).Index(VECTOR_STORE_INDEX_NAME),
            namespace: options.namespace,
            textKey: PINECONE_TEXT_KEY,
        });
        break;
        
        case StoreType.QDRANT: await QdrantVectorStore.fromDocuments(docs,embeddings,{
            collectionName:options.namespace,
            url: process.env.QDRANT_URL,
        });
        break;

        default:
            const validStores = Object.values(StoreType).join(', ');
            throw new Error(`
                Invalid store Env var: ${process.env.STORE}
                Valid values are: ${validStores}`)
    }

    
}