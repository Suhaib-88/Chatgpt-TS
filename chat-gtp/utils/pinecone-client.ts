import {PineconeClient} from '@pinecone-database/pinecone';

if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY){
    throw new Error('pinecone env missing api keys');
}

async function initPinecone() {
    try{
        const pinecone = new PineconeClient();
        await pinecone.init({
            environment: process.env.PINECONE_ENVIRONMENT ?? '',
            apiKey: process.env.PINECONE_API_KEY ?? ''
        });
        return pinecone
    }
    catch (error) {
        console.log("error", error)
        throw new Error("failed to initialize Pinecone Client, ensure correct envirment is set")
}
}
export const pinecone = initPinecone();