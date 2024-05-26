import { NextFunction, Request, Response } from "express";
import { TinyUrl } from "../db/tinyUrlModel.js";
import { nanoid } from "nanoid"
import { validateUrlLink } from "../validation/urlValidation.js";
import moment from "moment"

//using nanoid library creating shortUrl, saving original and shortened with part of nanoid. And returning short url to client
export async function shortUrl(req: Request, res: Response, next: NextFunction) {
    const baseUrl = "http://localhost:3000"

    let { originalUrl } = req.body
    if (validateUrlLink(originalUrl)) {
        let orgUrl = await TinyUrl.findOne({ originalUrl: originalUrl })
        let existingShortenerUrl = await TinyUrl.findOne({ url: originalUrl })

        if (orgUrl || existingShortenerUrl) {
            res.send({ url: orgUrl.url })
        } else {
            let random = nanoid(6)
            let shortenedUrl = `${baseUrl}/${random}`
            let savedUrl = await new TinyUrl({
                originalUrl: originalUrl,
                urlPart: random,
                url: shortenedUrl,
            }).save()
            res.send({ url: savedUrl.url })
        }
    } else {
        res.status(400).send({
            message: 'Invalid URL link'
        });
    }
}

//updating date and number of clicks when user uses shortened url
export async function url(req: Request, res: Response, next: NextFunction) {

    let url = req.params["url"]

    let foundUrl = await TinyUrl.findOne({ urlPart: url })

    if (foundUrl) {
        let clicks = {
            numOfClicks: 1,
            timestamp: moment().format("YYYY,MM-DD HH:mm:ss"),
        };
        await TinyUrl.updateOne({ urlPart: url }, { $push: { clicks: clicks } })
        res.redirect(foundUrl.originalUrl)
    } else {
        res.status(404).send({
            message: 'url not found'
        });
    }
}

//finding urls that are less than 24h activated
export async function findPopular(req: Request, res: Response, next: NextFunction) {
    let dayBefore = moment().subtract(24, "hours").toDate();

    const popularUrls = await TinyUrl.aggregate([
        { $unwind: "$clicks" },
        { $match: { "clicks.timestamp": { $gte: dayBefore } } },
        {
            $group: {
                _id: "$url",
                url: { $first: "$url" },
                originalUrl: { $first: "$originalUrl" },
                numOfClicks: { $sum: "$clicks.numOfClicks" },
            },
        },
        { $sort: { count: -1 } },
    ]);

    if (popularUrls) {
        res.send(popularUrls)
    } else {
        res.status(404).send({
            message: "No activity on links in last 24h"
        })
    }
}
