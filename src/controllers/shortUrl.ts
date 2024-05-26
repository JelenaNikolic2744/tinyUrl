import { NextFunction, Request, Response } from "express";
import { TinyUrl } from "../db/tinyUrlModel.js";
import { nanoid } from "nanoid"
import { validateUrlLink } from "../validation/urlValidation.js";
import moment from "moment"

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
                numOfClicks: 0
            }).save()
            res.send({ url: savedUrl.url })
        }
    } else {
        res.status(400).send({
            message: 'Invalid URL link'
        });
    }
}

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
    }
}

export async function findPopular(req: Request, res: Response, next: NextFunction) {
    let currentDay = moment().format("YYYY,MM-DD HH:mm:ss")
    let dayBefore = moment().add(-24, 'hours').format("YYYY,MM-DD HH:mm:ss");

    let data = await TinyUrl.find()
    let lastDayUrls = []

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].clicks.length; j++) {
            let timestamp = data[i].clicks[j].timestamp
            if(new Date(dayBefore) < timestamp){
                lastDayUrls.push(data[i].clicks[j])
            }
        }
    }


    // console.log(data)
    // console.log(new Date(currentDay))
    // console.log(dayBefore)
    res.send(data)
}
