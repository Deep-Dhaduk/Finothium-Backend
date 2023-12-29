const express = require('express')
const Commoncontroller = require('../controllers/common.controller');
const auth = require('../middlewares/auth');
const router = express.Router();


router.post(
    "/create-common",
    auth.verifyToken,
    Commoncontroller.CreateCommon
);

router.get(
    "/list-common",
    auth.verifyToken,
    Commoncontroller.ListCommon
);

router.get(
    "/list-common/:id",
    auth.verifyToken,
    Commoncontroller.getCommonById
);

router.delete(
    "/delete-common/:id",
    auth.verifyToken,
    Commoncontroller.deleteCommon
);

router.put(
    "/update-common/:id",
    auth.verifyToken,
    Commoncontroller.updateCommon
);
module.exports = router;