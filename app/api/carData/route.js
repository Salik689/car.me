// import { NextResponse } from "next/server";
import { fetchDVLAData } from "@/lib/dvla"; // DVLA fetch utility

export async function POST(req) {
    console.log("api running-------------------------------------------------------");

    try {
        const body = await req.json();
        console.log("body", body);
    
        const nPlate = body.reg
        console.log(`nPlate: ${nPlate} and nPlate: ${body.reg}`);
        
        const dvla = nPlate ? await fetchDVLAData(nPlate) : {};

        const jobData = {
            ...body,
            ...dvla, // ✅ flatten DVLA fields into top-level
        };

        // console.log(jobData);
        return new Response(JSON.stringify(jobData))
    }
    catch(err) {
        console.log("error!!!!!!!");
        console.error(err);
    }

}