const mongoose = require('mongoose');
const { verifyAccessToken } = require('../middlewares/requireLogin');

const Quote = mongoose.model('Quote');

module.exports = app => {

  app.get('/api/skillChasers/quotes', verifyAccessToken, async (req, res) => {
    const quotes = await Quote.find({});
    if (quotes) {
      res.status(200).json({ "status": "OK", "error": "{}", "payload": quotes });
    } else {
      res.status(404).json({ "status": "KO", "Quotes not found": "{}", "payload": "{}" });
    }
  });

  app.get('/api/skillChasers/quote/:id', verifyAccessToken, async (req, res) => {
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
    const { problemDescription, skills, placeOfWork, numOfConsultant, projectDuration, status, remark } = req.body;

    const quote = new Quote({
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
        console.log("couldnt save the quote in the database")
        return res.status(500).json({ "status": "KO", "error": "Internal Server Error", "payload": "{}" });
      }
    } catch (e) {
      console.log("exception during save" + e)
      return res.status(500).json({ "status": "KO", "error": "Internal Server Error" + e, "payload": "{}" });
    }
  });

  app.put('/api/skillChasers/approve/quote/:id', verifyAccessToken, async (req, res) => {
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
        console.log("couldnt save the quote in the database")
        return res.status(500).json({ "status": "KO", "error": "Internal Server Error", "payload": "{}" });
      }
    } catch (e) {
      console.log("exception during save" + e)
      return res.status(500).json({ "status": "KO", "error": "Internal Server Error" + e, "payload": "{}" });
    }

  });
};
