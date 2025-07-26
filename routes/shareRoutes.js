import { Router } from 'express';
const router = Router();

/**
 * Share a reddit post
 */
router.post('/reddit', function(req, res) {
    const shareUrl = req.body.shareUrl;
    console.log('Request from %s: share from reddit: %s', req.ip, shareUrl);
});

export default router;