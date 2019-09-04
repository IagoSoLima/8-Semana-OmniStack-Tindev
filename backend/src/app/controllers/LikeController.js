import Dev from '../models/Dev';

export default {
  async store(req, res) {
    console.log(req.io, req.connectedUsers);

    const { user } = req.headers;
    const { dev_id } = req.params;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(dev_id);

    if (targetDev.likes.includes(user)) {
      const loggedSocket = req.connectedUsers[user];
      const targetSocket = req.connectedUsers[dev_id];

      if (loggedSocket) {
        req.io.to(loggedSocket).emit('match', targetDev);
      }

      if (targetSocket) {
        req.io.to(targetSocket).emit('match', loggedDev);
      }
    }

    if (!targetDev) {
      return res.status(400).json({ error: 'Usuário não cadastrado' });
    }

    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  },
};
