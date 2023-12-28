require('dotenv').config()
const express = require("express");
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', require("./routes/user.route"));
app.use('/tenant', require("./routes/tenant.route"));
app.use('/role', require("./routes/role.route"));
app.use('/parentmenu', require("./routes/parentmenu.route"));
app.use('/childmenu', require("./routes/childmenu.route"));
app.use('/menu', require("./routes/menu.route"));
app.use('/company', require("./routes/company.route"));

app.use((req, res, next) => {
        next(new Error("Route not found!"));
});

app.listen(8080, async () => {
        console.log(`SERVER IS RUNNING PORT ${process.env.PORT}`);
});
