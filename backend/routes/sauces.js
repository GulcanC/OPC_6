const express = require('express');

const router = express.Router();
// const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
//     /api/sauces yerine sadece / koy

router.post('/', auth, multer, stuffCtrl.createSauce);

router.get('/:id', auth, stuffCtrl.getOneSauce);

router.get('/', auth, stuffCtrl.getAllSauces);

router.put('/:id', auth, multer, stuffCtrl.modifySauce);

router.delete('/:id', auth, stuffCtrl.deleteSauce);

/* router.post('/', stuffCtrl.createSauce);

router.get('/', stuffCtrl.getOneSauce);

router.get('/:id', stuffCtrl.getAllSauces);

router.put('/:id', stuffCtrl.modifySauce);

router.delete('/:id', stuffCtrl.deleteSauce);
 */
module.exports = router;  