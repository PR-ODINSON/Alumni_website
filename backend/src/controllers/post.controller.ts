import { Response, NextFunction } from 'express';
import Post, { Comment } from '../models/Post';
import Notification from '../models/Notification';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { content, postType, media, tags, mentions, visibility, poll, linkedEvent, linkedJob } = req.body;

  const post = await Post.create({
    author: req.user._id,
    content,
    postType: postType || 'update',
    media: media || [],
    tags: tags || [],
    mentions: mentions || [],
    visibility: visibility || 'public',
    poll,
    linkedEvent,
    linkedJob,
  });

  await post.populate('author', 'firstName lastName avatar role isVerified');

  // Notify mentions
  if (mentions?.length) {
    const notifications = mentions.map((userId: string) => ({
      recipient: userId,
      sender: req.user._id,
      type: 'mention',
      title: 'You were mentioned in a post',
      message: `${req.user.firstName} ${req.user.lastName} mentioned you in a post`,
      link: `/feed/${post._id}`,
    }));
    await Notification.insertMany(notifications);

    const io = req.app.get('io');
    mentions.forEach((userId: string) => {
      io?.to(userId).emit('notification', { type: 'mention' });
    });
  }

  res.status(201).json({ success: true, data: post });
});

export const getFeed = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20, postType, filter = 'all' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const query: any = { isPublished: true };
  if (postType) query.postType = postType;
  if (filter === 'announcements') query.isAnnouncement = true;

  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate('author', 'firstName lastName avatar role isVerified')
      .populate({
        path: 'comments',
        options: { limit: 3, sort: { createdAt: -1 } },
        populate: { path: 'author', select: 'firstName lastName avatar' },
      })
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Post.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: posts,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

export const getPost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const post = await Post.findById(req.params.postId)
    .populate('author', 'firstName lastName avatar role isVerified bio')
    .populate({
      path: 'comments',
      match: { isDeleted: false, parentComment: null },
      populate: [
        { path: 'author', select: 'firstName lastName avatar' },
        {
          path: 'parentComment',
          populate: { path: 'author', select: 'firstName lastName avatar' },
        },
      ],
    });

  if (!post) return next(new AppError('Post not found.', 404));

  await Post.findByIdAndUpdate(req.params.postId, { $inc: { views: 1 } });

  res.json({ success: true, data: post });
});

export const updatePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return next(new AppError('Post not found.', 404));

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to edit this post.', 403));
  }

  const { content, tags, visibility } = req.body;
  if (content) post.content = content;
  if (tags) post.tags = tags;
  if (visibility) post.visibility = visibility;
  await post.save();

  res.json({ success: true, data: post });
});

export const deletePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return next(new AppError('Post not found.', 404));

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized.', 403));
  }

  await Post.findByIdAndDelete(req.params.postId);
  await Comment.deleteMany({ post: req.params.postId });

  res.json({ success: true, message: 'Post deleted.' });
});

export const likePost = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return next(new AppError('Post not found.', 404));

  const userId = req.user._id;
  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    post.likes = post.likes.filter((id: any) => id.toString() !== userId.toString());
  } else {
    post.likes.push(userId);
    if (post.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: userId,
        type: 'post_like',
        title: 'Someone liked your post',
        message: `${req.user.firstName} ${req.user.lastName} liked your post`,
        link: `/feed/${post._id}`,
      });
      req.app.get('io')?.to(post.author.toString()).emit('notification', { type: 'post_like' });
    }
  }

  await post.save();
  res.json({ success: true, likes: post.likes.length, isLiked: !alreadyLiked });
});

export const addComment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return next(new AppError('Post not found.', 404));

  const comment = await Comment.create({
    post: req.params.postId,
    author: req.user._id,
    content: req.body.content,
    parentComment: req.body.parentCommentId,
  });

  await comment.populate('author', 'firstName lastName avatar');
  post.comments.push(comment._id);
  await post.save();

  if (post.author.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: post.author,
      sender: req.user._id,
      type: 'post_comment',
      title: 'New comment on your post',
      message: `${req.user.firstName} ${req.user.lastName} commented on your post`,
      link: `/feed/${post._id}`,
    });
    req.app.get('io')?.to(post.author.toString()).emit('notification', { type: 'post_comment' });
  }

  res.status(201).json({ success: true, data: comment });
});

export const getComments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const comments = await Comment.find({
    post: req.params.postId,
    isDeleted: false,
    parentComment: null,
  })
    .populate('author', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, data: comments });
});

export const likeComment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return next(new AppError('Comment not found.', 404));

  const userId = req.user._id;
  const alreadyLiked = comment.likes.includes(userId);

  if (alreadyLiked) {
    comment.likes = comment.likes.filter((id: any) => id.toString() !== userId.toString());
  } else {
    comment.likes.push(userId);
  }

  await comment.save();
  res.json({ success: true, likes: comment.likes.length, isLiked: !alreadyLiked });
});

export const deleteComment = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return next(new AppError('Comment not found.', 404));

  if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized.', 403));
  }

  comment.isDeleted = true;
  await comment.save();

  res.json({ success: true, message: 'Comment deleted.' });
});
