// Redirect to an url (click on notification).
module.exports = function (req, res, next) {
  if (!req.query.url)
    return next(new Error('Can\'t find url'));

  res.redirect(req.query.url);
};
