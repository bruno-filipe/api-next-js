import { NextResponse } from "next/server";

export function middleware(req){
    const origin = req.headers.get('origin');

    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Max-Age", "86400");

    /*if(req.method === 'OPTIONS'){
        return NextResponse.ok('');
    }*/

    return res;
}

export const config = {
    matcher: '/api/:path',
};