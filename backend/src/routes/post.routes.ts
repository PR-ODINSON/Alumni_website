import { Router } from 'express';
import {
  createPost, getFeed, getPost, updatePost, deletePost,
  likePost, addComment, getComments, likeComment, deleteComment,
} from '../controllers/post.controller';
import { protect, optionalAuth } from '../middleware/auth';
import { requirePermission, requirePolicy } from '../middleware/authorization';

const router = Router();

router.get('/', optionalAuth, getFeed);
router.get('/:postId', optionalAuth, getPost);
router.get('/:postId/comments', optionalAuth, getComments);

router.use(protect);
router.post('/', requirePermission('feed:create'), createPost);
router.put('/:postId', requirePolicy('feed:update', 'Post', 'postId'), updatePost);
router.delete('/:postId', requirePolicy('feed:delete', 'Post', 'postId'), deletePost);
router.post('/:postId/like', likePost);
router.post('/:postId/comments', requirePolicy('comment:create', 'Post', 'postId'), addComment);
router.post('/comments/:commentId/like', likeComment);
router.delete('/comments/:commentId', requirePolicy('comment:delete', 'Comment', 'commentId'), deleteComment);

export default router;
