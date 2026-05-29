import { Router } from 'express';
import {
  createPost, getFeed, getPost, updatePost, deletePost,
  likePost, addComment, getComments, likeComment, deleteComment,
} from '../controllers/post.controller';
import { protect, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getFeed);
router.get('/:postId', optionalAuth, getPost);
router.get('/:postId/comments', optionalAuth, getComments);

router.use(protect);
router.post('/', createPost);
router.put('/:postId', updatePost);
router.delete('/:postId', deletePost);
router.post('/:postId/like', likePost);
router.post('/:postId/comments', addComment);
router.post('/comments/:commentId/like', likeComment);
router.delete('/comments/:commentId', deleteComment);

export default router;
