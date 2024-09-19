import { verifyAccessToken } from '../middlewares/requireLogin.js';
import Quote from '../models/Quote.js';
import Logger from '../logger/logger.js';

const quoteRoutes = app => {

  app.get('/api/skillChasers/quotes', verifyAccessToken, async (req, res) => {
    Logger.info('<Quote Route: > - Read all quotes : ' + req.ip);
    const quotes = await Quote.find({});
    if (quotes) {
      Logger.info('success');
      res.status(200).json({ "status": "OK", "error": "{}", "payload": quotes });
    } else {
      res.status(404).json({ "status": "KO", "Quotes not found": "{}", "payload": "{}" });
    }
  });

  app.get('/api/skillChasers/quote/:id', verifyAccessToken, async (req, res) => {
    Logger.info('<Quote Route: > -  Read all quotes by id: ' + req.ip);
    const quote = await Quote.findOne({
      _id: req.params.id
    });

    if (quote) {
      res.status(200).json({ "status": "OK", "error": "{}", "payload": quote });
    } else {
      res.status(404).json({ "status": "KO", "error": "Quote not found", "payload": "{}" });
    }
  });

  app.get('/api/skillChasers/quotes/:status', verifyAccessToken, async (req, res) => {
    Logger.info('<Quote Route: > - Read all quotes by status: ' + req.ip);
    const status = req.params.status;
    const quotes = await Quote.find({
      "status": status
    });
    if (quotes) {
      res.status(200).json({ "status": "OK", "error": "{}", "payload": quotes });
    } else {
      res.status(404).json({ "status": "KO", "error": "Quotes not found with status: " + status, "payload": "{}" });
    }
  });

  app.post('/api/skillChasers/register/quote', verifyAccessToken, async (req, res) => {
    Logger.info('Register quotes: ' + req.ip);
    const { userName, problemDescription, skills, placeOfWork, numOfConsultant, projectDuration, status, remark } = req.body;

    const quote = new Quote({
      userName,
      problemDescription,
      skills,
      placeOfWork,
      numOfConsultant,
      projectDuration,
      status,
      remark
    });

    try {
      const savedQuote = await quote.save();
      if (savedQuote) {
        return res.status(200).json({ "status": "OK", "error": "{}", "payload": savedQuote });
      } else {
        Logger.error('<Quote Route: > - couldnt save the quote in the database' + req.ip);
        return res.status(500).json({ "status": "KO", "error": "Internal Server Error", "payload": "{}" });
      }
    } catch (e) {
      Logger.error('<Quote Route: > - ' + e.message + '-' + req.ip);
      return res.status(500).json({ "status": "KO", "error": e.message, "payload": "{}" });
    }
  });

  app.put('/api/skillChasers/approve/quote/:id', verifyAccessToken, async (req, res) => {
    Logger.info('<Quote Route: > - approve a quote: ' + req.ip);
    const { status, remark } = req.body;

    var query = { _id: req.params.id };

    const approvedQuote = await Quote.findOne({
      _id: req.params.id
    });

    const approve = { $set: { status: status, remark: remark } }

    try {
      const updatedQuote = await Quote.findOneAndUpdate(query, approve, { new: true });
      if (updatedQuote) {
        return res.status(200).json({ "status": "OK", "error": "{}", "payload": updatedQuote });
      } else {
        Logger.error('<Quote Route: > - couldnt update the quote in the database' + req.ip);
        return res.status(500).json({ "status": "KO", "error": "Internal Server Error", "payload": "{}" });
      }
    } catch (e) {
      Logger.error('<Quote Route: > - ' + e.message + '-' + req.ip);
      return res.status(500).json({ "status": "KO", "error": e.message, "payload": "{}" });
    }

  });
};

export { quoteRoutes };