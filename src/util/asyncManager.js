export const catchAsyncFailure = behavior => async (req, res, next) => {
  try { await behavior(req, res, next) }
  catch(e) { next(e) }
};
