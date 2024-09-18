import type { NextApiRequest, NextApiResponse } from "next";
import pdfHandler from "@/data-sources/pdfHandler";
import websiteHandler from "@/data-sources/websiteHandler";
import codebaseHandler from "@/data-sources/codebaseHandler";
import { error } from "console";

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
    try{
        const {type} = req.body
        if (req.method!=="POST"){
            return res.status(405).json({error:"Invalid request method"})
        }
        if (!type){
            return res.status(400).json({error:"Missing type parameter"})
        }
        const supportedTypes = ['pdf', 'website', 'codebase']
        if (!supportedTypes.includes(type)){
            return res.status(400).json({error:"Invalid type parameter"})
        }
        if (type ==="pdf"){
            return await pdfHandler(req, res)
        }
        else if (type=== 'website'){
            return await websiteHandler(req, res)
        }
        else if (type==="codebase"){
            return await codebaseHandler(req, res)
        }
    }
    catch(e:any){
        console.error(e)
        return res.status(500).json({error: e.message})
    }
}