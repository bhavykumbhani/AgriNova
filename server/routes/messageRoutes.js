const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/conversations', messageController.getConversations);
router.post('/conversations', messageController.getOrCreateConversation);
router.get('/conversations/:id/messages', messageController.getConversationMessages);
router.post('/conversations/:id/messages', messageController.sendMessageHttp);

module.exports = router;
