

import {NextResponse, NextRequest} from "next/server"
import {supabase} from "@/lib/supabase"

export async function GET(
    req: NextRequest,
    {params}:{params: Promise<{shortCode: string}>}
){
    const {shortCode} = await params;

    const {data, error } = await supabase
    .from("short_urls")
    .select("*")
    .eq("short_code", shortCode)
    .single();

    if (error || !data){
        return NextResponse.json(
         {error: "Short URL has been deactivated"},
         {status: 410}
        )
    }
     if (data.expired_at && new Date(data.expired_at)<= new Date()){
        return NextResponse.json(
            {error: "Short URL has been expired"},
            {status: 410}
        )
     }

     await supabase .from("short_urls").update({
        click_count: data.click_count + 1,
        last_clicked_at : new Date().toISOString(),
     })
     .eq("id", data.id)

     return NextResponse.redirect(data.original_url, 302)
     
}