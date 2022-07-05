const express = require('express');
const fileDownload_controller = require('../controllers/fileDownload.js');

const router = express.Router();
router.post('/', fileDownload_controller.downloadFile);

module.exports = router;

