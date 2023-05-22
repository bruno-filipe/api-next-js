const Allow = (handler) => (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "86400");

    if(req.method === 'OPTIONS'){
        res.status(200).end();
        return;
    }

    return handler(req, res);
}

export default Allow;