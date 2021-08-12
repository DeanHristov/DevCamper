const express = require('express');
const router = express.Router();
const {
    getAllBootCamps, getBootcampById, creatBootCamp,
    deleteBootCamp, updateBootCamp, modifyBootCamp
} = require('../controllers/bootcamps');

router.route('/')
    .get(getAllBootCamps)
    .post(creatBootCamp)

router.route('/:id')
    .get(getBootcampById)
    .delete(deleteBootCamp)
    .put(updateBootCamp)
    .patch(modifyBootCamp)

module.exports = router;
