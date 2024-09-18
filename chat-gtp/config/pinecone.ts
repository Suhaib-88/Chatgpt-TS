import exp from "constants";

if (process.env.STORE=== 'pinecone' && !process.env.VECTOR_STORE_INDEX_NAME){
    throw new Error(`
        Missing requirement Pinecone Environment variables,
        Please set the VECTOR_STORE_INDEX_NAME and PINECONE_API_KEY in the .env file`
    );
}

const VECTOR_STORE_INDEX_NAME= process.env.VECTOR_STORE_INDEX_NAME ?? '';
const PINECONE_NAME_SPACE= 'bot-test';

export const PINECONE_TEXT_KEY= 'text';
export { VECTOR_STORE_INDEX_NAME, PINECONE_NAME_SPACE};
