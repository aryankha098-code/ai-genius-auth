function freeModel(req, res) {
  res.status(200).json({
    status: 'success',
    model: 'AI-Genius Free Text Model',
    requestedBy: req.user,
    result: 'Free model response generated successfully.'
  });
}

function premiumModel(req, res) {
  const { prompt = 'Generate a premium AI response.' } = req.body;

  res.status(200).json({
    status: 'success',
    model: 'AI-Genius Premium Text/Image Model',
    requestedBy: req.user,
    prompt,
    result: 'Premium model response generated successfully.'
  });
}

function purgeCache(req, res) {
  res.status(200).json({
    status: 'success',
    requestedBy: req.user,
    message: 'AI model cache purged successfully.'
  });
}

module.exports = {
  freeModel,
  premiumModel,
  purgeCache
};
