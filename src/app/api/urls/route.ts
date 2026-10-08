import {NextResponse, NextRequest} from "next/server"
import {supabase} from "@/lib/supabase"
import crypto from "crypto"

function generateShortCode(length = 6){
    return crypto
     .randomBytes(length)
     .toString("base64url")
     .slice(0, length)
}

export async function POST(req:
    NextRequest){
        try {
            const body = await req.json();
            const { originalUrl, customCode, expiredAt} = body;

            if (!originalUrl){
                return NextResponse.json(
                    {error: "original URL is required" },
                    {status: 400}
                )
            }
            try {
                new URL(originalUrl)
            }catch {
                return NextResponse.json(
                    {error: "Invalid URL"},
                    {status: 422}
                )
            }
            
            const shortCode = customCode?.trim() || generateShortCode()

            const {data, error} = await supabase.from("short_urls")
            .insert({
                original_url: originalUrl,
                short_code: shortCode,
                expired_at: expiredAt,
            })
            .select().single();

            if(error){
                if(error.code === "23505"){
                    return NextResponse.json(
                        {error: "Short Code Already Existed"},
                        {status: 409})
                    
                }
                throw error;
            }
            return NextResponse.json(
                {id: data.id,
                    shortCode: data.short_code,
                    shortUrl: `${req.nextUrl.origin}/${data.short_code}`,
                    originalUrl: data.original_url,
                },
                 {status: 201}
            )
                
                } catch (err) {
                    console.error("Error in POST /api/urls:", err);
                    return NextResponse.json(
                        {error: "Internal Server Error"},
                        {status: 500}
                    )
        }
    }
