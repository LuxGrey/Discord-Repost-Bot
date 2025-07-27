import { Router } from 'express';
import { shareRedditPost } from '../controller/redditShareController.js';
const router = Router();

/**
 * Share a reddit post
 */
router.post('/reddit', shareRedditPost);

export default router;