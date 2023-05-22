const Allow = (handler) => (req, res) => {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Max-Age", "86400");

    if(req.method === 'OPTIONS'){
        res.status(200).end();
        return;
    }

    return handler(req, res);
}

export default Allow;