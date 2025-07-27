import { Router } from 'express';
import { sendMessage } from '../discord.js';
const router = Router();

/**
 * Share a reddit post
 */
router.post('/reddit', async (req, res) => {
    // validate request body data
    if (!isRedditShareValid(req.body)) {
        res.status(400).send('Bad Request');
        return;
    }

    // build Discord message content
    const messageContent = buildRedditMessage(req.body);

    // send the Discord message
    await sendMessage(process.env.CHANNEL_ID, messageContent);
    res.status(200).send('OK');
});

function isRedditShareValid(requestBody) {
    if (!requestBody.postUrl) {
        // request body lacks expected data
        return false;
    }

    let url;
    try {
        url = new URL(requestBody.postUrl);
    } catch (err) {
        // postUrl is not a valid URL
        return false;
    }

    if (url.host !== 'reddit.com') {
        // specified URL is not a reddit URL
        return false;
    }

    const redditPostPathRegex = /^\/(r\/[A-Za-z0-9_]+|user\/[A-Za-z0-9_-]+)\/comments\/[a-z0-9]{6,8}(\/[^\/\s]*)?\/$/;
    if (!url.pathname.match(redditPostPathRegex)) {
        // path does not lead to a reddit post
        return false;
    }

    return true;
}

function buildRedditMessage(requestBody) {
    return requestBody.postUrl;
}

export default router;