import { extractShortCode } from "@/helperFunctions/extractShortCode";
import { readDataFromDb, updateDataOnDb } from "../../helperFunctions/firebaseFunctions";

const cache = {};

export default async function (req, res) {
    if(req.method === 'POST') {
        const { url } = req.body;
        if(url) {
            const shortCode = extractShortCode(url);
            const data = {long_url: url}
            updateDataOnDb(shortCode, data);
            res.status(200).json({shortUrl: shortCode});
        } else {
            res.status(400).json({error: 'Misssing URL on the request'});
        }
    } else if (req.method === 'GET') {
        const param = req.query;
        const cachedData = cache[param.shortCode];

        if (cachedData) {
            res.status(200).json({ redirect: cachedData.long_url });
        } else {
            const data = await readDataFromDb(param.shortCode);
            if (data) {
                cache[param.shortCode] = data;
                res.status(200).json({ redirect: data.long_url });
            } else {
                res.status(400).json({ message: 'The provided short URL is not valid, please verify it and try again.' });
            }
        }
    } else {
        res.status(405).json({ error: 'Method not allowed. This API only accepts GET method.' });
    }
}