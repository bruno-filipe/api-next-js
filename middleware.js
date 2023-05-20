import { NextResponse } from "next/server";

export function middleware(req){
    const origin = req.headers.get('orgin');
    console.log(origin);

    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Max-Age", "86400");

    console.log("Middleware!");
    console.log(req.method);
    console.log(req.url);

    return res;
}

export const config = {
    matcher: '/api/:path',
};