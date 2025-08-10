import { sendMessage } from '../discord.js';

export async function shareRedditPost(req, res) {
    // validate request body data
    if (!isRedditShareValid(req.body)) {
        res.status(400).send('Bad Request');
        return;
    }

    // build Discord message content
    const messageContent = await buildRedditMessage(req.body);

    // send the Discord message
    await sendMessage(messageContent);
    res.status(200).send('OK');
}

function isRedditShareValid(requestBody) {
    if (!requestBody.postUrl) {
        console.error('Request body is missing postUrl');
        return false;
    }

    let url;
    try {
        url = new URL(requestBody.postUrl);
    } catch (err) {
        console.error('postUrl is not a valid URL:', requestBody.postUrl);
        return false;
    }

    const redditDomainRegex = /^(www\.)?reddit\.com$/;
    if (!url.host.match(redditDomainRegex)) {
        console.error('postUrl is not a reddit URL:', requestBody.postUrl);
        return false;
    }

    const redditPostPathRegex = /^\/(r\/[A-Za-z0-9_]+|user\/[A-Za-z0-9_-]+)\/comments\/[a-z0-9]{6,8}(\/[^\/\s]*)?\/$/;
    if (!url.pathname.match(redditPostPathRegex)) {
        console.error('postUrl is not a reddit post URL:', requestBody.postUrl);
        return false;
    }

    return true;
}

async function buildRedditMessage(requestBody) {
    const postUrl = requestBody.postUrl;
    const postData = await fetchRedditPostData(postUrl);

    const embedUrl = getRedditPostEmbedUrl(postData);
    if (embedUrl) {
        // the reddit post's content is an embed that uses an URL
        // build the message to include the embed URL, as the reddit post itself will not produce a useful embed for Discord
        return buildRedditWithEmbedMessage(postUrl, embedUrl);
    }

    // use rxddit URL for better embed
    return buildRxdditUrl(postUrl);
}

/**
 * Turns a reddit URL into a rxddit URL, which produces better embeds for reddit posts
 */
function buildRxdditUrl(redditPostUrl) {
    const url = new URL(redditPostUrl);
    url.host = url.host.replace('e', 'x');
    return url.toString();
}

async function fetchRedditPostData(redditPostUrl) {
    const redditPostJsonUrl = redditPostUrl.slice(0, redditPostUrl.length - 1) + '.json';
    const response = await fetch(redditPostJsonUrl);
    const json = await response.json();

    return json[0].data.children[0].data;
}

/**
 * If the provided reddit post data indicate that the post uses an external embed, return its URL.
 * Otherwise return null.
 */
function getRedditPostEmbedUrl(redditPostData) {
    const media = redditPostData.media || redditPostData.secure_media;
    if (media?.oembed?.provider_name) {
        return media.oembed.url || redditPostData.url;
    }

    return null;
}

/**
 * Assumes to receive an URL to a reddit post and an embed URL that was used to supply the content for that post.
 * Builds a message that contains the reddit post URL in non-embed format and the embed URL for the alternative embed.
 */
function buildRedditWithEmbedMessage(redditPostUrl, embedUrl) {
    return `<${redditPostUrl}>\n${embedUrl}`;
}