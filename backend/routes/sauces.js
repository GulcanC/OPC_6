const express = require('express');

const router = express.Router();

const multer = require('../middleware/multer-config');

const ctrlSauce = require('../controllers/sauces');

const auth = require('../middleware/auth');
//     /api/sauces yerine sadece / koy

router.post('/', auth, multer, ctrlSauce.createSauce);

router.get('/:id', auth, ctrlSauce.getOneSauce);

router.get('/', auth, ctrlSauce.getAllSauces);

router.put('/:id', auth, multer, ctrlSauce.modifySauce);

router.delete('/:id', auth, ctrlSauce.deleteSauce);

router.post("/:id/like", auth, multer, ctrlSauce.likeDislike);

module.exports = router;  