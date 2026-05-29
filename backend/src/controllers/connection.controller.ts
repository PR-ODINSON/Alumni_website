import { Response, NextFunction } from 'express';
import Connection from '../models/Connection';
import Notification from '../models/Notification';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const sendConnectionRequest = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { message } = req.body;

  if (userId === req.user._id.toString()) {
    return next(new AppError('Cannot connect with yourself.', 400));
  }

  const existing = await Connection.findOne({
    $or: [
      { requester: req.user._id, recipient: userId },
      { requester: userId, recipient: req.user._id },
    ],
  });

  if (existing) {
    if (existing.status === 'accepted') return next(new AppError('Already connected.', 400));
    if (existing.status === 'pending') return next(new AppError('Request already pending.', 400));
    if (existing.status === 'blocked') return next(new AppError('Cannot send request.', 400));
    existing.status = 'pending';
    existing.requester = req.user._id;
    existing.recipient = userId as any;
    existing.message = message;
    await existing.save();
  } else {
    await Connection.create({
      requester: req.user._id,
      recipient: userId,
      message,
    });
  }

  await Notification.create({
    recipient: userId,
    sender: req.user._id,
    type: 'connection_request',
    title: 'New Connection Request',
    message: `${req.user.firstName} ${req.user.lastName} wants to connect with you`,
    link: `/profile/${req.user._id}`,
  });

  req.app.get('io')?.to(userId).emit('notification', { type: 'connection_request' });

  res.status(201).json({ success: true, message: 'Connection request sent.' });
});

export const respondToRequest = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { connectionId } = req.params;
  const { action } = req.body;

  const connection = await Connection.findById(connectionId);
  if (!connection) return next(new AppError('Request not found.', 404));
  if (connection.recipient.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized.', 403));
  }
  if (connection.status !== 'pending') {
    return next(new AppError('Request has already been processed.', 400));
  }

  connection.status = action === 'accept' ? 'accepted' : 'rejected';
  connection.respondedAt = new Date();
  await connection.save();

  if (action === 'accept') {
    await Notification.create({
      recipient: connection.requester,
      sender: req.user._id,
      type: 'connection_accepted',
      title: 'Connection Accepted',
      message: `${req.user.firstName} ${req.user.lastName} accepted your connection request`,
      link: `/profile/${req.user._id}`,
    });
    req.app.get('io')?.to(connection.requester.toString()).emit('notification', { type: 'connection_accepted' });
  }

  res.json({ success: true, data: connection });
});

export const getConnections = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const targetId = userId || req.user._id;

  const connections = await Connection.find({
    $or: [{ requester: targetId }, { recipient: targetId }],
    status: 'accepted',
  })
    .populate('requester', 'firstName lastName avatar role bio')
    .populate('recipient', 'firstName lastName avatar role bio')
    .sort('-createdAt');

  const formatted = connections.map((c) => {
    const other = c.requester._id.toString() === targetId.toString() ? c.recipient : c.requester;
    return { connection: c._id, user: other, connectedAt: c.updatedAt };
  });

  res.json({ success: true, data: formatted, total: formatted.length });
});

export const getPendingRequests = asyncHandler(async (req: AuthRequest, res: Response) => {
  const [incoming, outgoing] = await Promise.all([
    Connection.find({ recipient: req.user._id, status: 'pending' })
      .populate('requester', 'firstName lastName avatar role bio')
      .sort('-createdAt'),
    Connection.find({ requester: req.user._id, status: 'pending' })
      .populate('recipient', 'firstName lastName avatar role bio')
      .sort('-createdAt'),
  ]);

  res.json({ success: true, data: { incoming, outgoing } });
});

export const getConnectionStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  const connection = await Connection.findOne({
    $or: [
      { requester: req.user._id, recipient: userId },
      { requester: userId, recipient: req.user._id },
    ],
  });

  res.json({
    success: true,
    data: {
      status: connection?.status || 'none',
      connectionId: connection?._id,
      isRequester: connection?.requester.toString() === req.user._id.toString(),
    },
  });
});

export const removeConnection = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { connectionId } = req.params;

  const connection = await Connection.findById(connectionId);
  if (!connection) return next(new AppError('Connection not found.', 404));

  if (connection.requester.toString() !== req.user._id.toString() &&
    connection.recipient.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized.', 403));
  }

  await Connection.findByIdAndDelete(connectionId);
  res.json({ success: true, message: 'Connection removed.' });
});

export const getMutualConnections = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  const getConnectedIds = async (id: string) => {
    const conns = await Connection.find({
      $or: [{ requester: id }, { recipient: id }],
      status: 'accepted',
    }).select('requester recipient');

    return conns.map((c) =>
      c.requester.toString() === id ? c.recipient.toString() : c.requester.toString()
    );
  };

  const [myConnections, theirConnections] = await Promise.all([
    getConnectedIds(req.user._id.toString()),
    getConnectedIds(userId),
  ]);

  const mutualIds = myConnections.filter((id) => theirConnections.includes(id));

  res.json({ success: true, data: { mutualCount: mutualIds.length, mutualIds } });
});
