const express = require('express')
const Menucontroller = require('../controllers/menu.controller');
const router = express.Router();

router.post(
    "/create-menu",
    Menucontroller.CreateMenu
);

router.post(
    "/login",
    Menucontroller.CreateMenu
);

router.get(
    "/list-menu",
    Menucontroller.ListMenu
);

router.get(
    "/list-menu/:id",
    Menucontroller.getMenuById
);

router.delete(
    "/delete-menu/:id",
    Menucontroller.deleteMenu
);

router.put(
    "/update-menu/:id",
    Menucontroller.updateMenu
);
module.exports = router;