export default behavior => async (req, res, next) => {
  try { await behavior(req, res, next); }
  catch(e) { return next(e); }
};
