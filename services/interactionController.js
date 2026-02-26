const Menfess = require("../models/menfess");

// 1. Tambah Komentar atau Balasan
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params; // ID Menfess utama
    const { name, content, isSender, replyTo, replyToName } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "comment content is required",
      });
    }

    const message = await Menfess.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "message not found",
      });
    }

    // Menambahkan komentar baru ke dalam array comments
    message.comments.push({
      name: name || "anonymous",
      content,
      isSender: isSender || false,
      replyTo: replyTo || null, // ID komentar yang dibalas
      replyToName: replyToName || null, // Nama yang dibalas (misal: "anonymous")
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: "comment posted successfully",
      data: message.comments,
    });
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).json({
      success: false,
      message: "failed to post comment",
    });
  }
};

// 2. Reaksi pada Pesan Utama (Message Reaction)
exports.reactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // misal: 'heart', 'thumbsup'

    const message = await Menfess.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "message not found",
      });
    }

    // Cari tipe reaksi di dalam array reactions
    const reactionIndex = message.reactions.findIndex((r) => r.type === type);

    if (reactionIndex > -1) {
      message.reactions[reactionIndex].count += 1;
    } else {
      message.reactions.push({ type, count: 1 });
    }

    await message.save();
    res.json({
      success: true,
      data: message.reactions,
    });
  } catch (err) {
    console.error("Error reacting to message:", err);
    res.status(500).json({
      success: false,
      message: "failed to react to message",
    });
  }
};

// 3. Reaksi pada Komentar (Comment Reaction)
exports.reactComment = async (req, res) => {
  try {
    const { messageId, commentId } = req.params;
    const { type } = req.body;

    const message = await Menfess.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "message not found",
      });
    }

    // Menggunakan method .id() milik Mongoose untuk mencari sub-document dalam array
    const comment = message.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "comment not found",
      });
    }

    const reactionIndex = comment.reactions.findIndex((r) => r.type === type);

    if (reactionIndex > -1) {
      comment.reactions[reactionIndex].count += 1;
    } else {
      comment.reactions.push({ type, count: 1 });
    }

    await message.save();
    res.json({
      success: true,
      data: comment.reactions,
    });
  } catch (err) {
    console.error("Error reacting to comment:", err);
    res.status(500).json({
      success: false,
      message: "failed to react to comment",
    });
  }
};
