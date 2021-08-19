const express = require('express');

const router = express.Router( { mergeParams: true });
const ReviewModule = require('../models/Review');

const advanceFiltering = require('../middlewares/advanceFiltering');
const { protectRoute, grantAccessToRoles } = require('../middlewares/auth')
const {USER_ROLES} = require("../commons/constants");
const {
    getAllReviews, getReview, createReview,
    modifyReview, deleteReview
} = require('../controllers/reviews');
const populateParams = {
    path: 'bootcamp',
    select: 'name description'
};

router.route('/')
    .get(advanceFiltering(ReviewModule, populateParams), getAllReviews)
    .post(protectRoute, grantAccessToRoles(USER_ROLES.USER, USER_ROLES.ADMIN), createReview)

router.route('/:reviewId')
    .get(getReview)
    .put(protectRoute, grantAccessToRoles(USER_ROLES.USER, USER_ROLES.ADMIN), modifyReview)
    .delete(protectRoute, grantAccessToRoles(USER_ROLES.USER, USER_ROLES.ADMIN), deleteReview)

module.exports = router;
