const express = require('express');
const router = express.Router();
const {
    getAllBootCamps, getBootCamp, creatBootCamp,
    deleteBootCamp, updateBootCamp, modifyBootCamp
} = require('../controllers/bootcamps');

router.route('/')
    .get(getAllBootCamps)
    .post(creatBootCamp)

router.route('/:id')
    .get(getBootCamp)
    .delete(deleteBootCamp)
    .put(updateBootCamp)
    .patch(modifyBootCamp)

module.exports = router;
