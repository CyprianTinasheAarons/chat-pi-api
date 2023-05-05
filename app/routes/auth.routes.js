const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
    const router = require("express").Router();
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    })
    
    // Sign up
    router.post(
        "/signup",
        [
        verifySignUp.checkDuplicateUsernameOrEmail
        ],
        controller.signup
    );
    
    // Sign in
    router.post("/signin", controller.signin);

    //Verfiy a User with email
    router.put("/verify/:email", controller.verify);

    //Admin 2factor Authetication
    router.post("/admin-login", controller.adminLogin);

    // Admin 2factor Authetication
    router.post("/admin-2fa", controller.admin2fa);

    // Password reset
    router.post("/reset", controller.resetPassword);

    router.get("/reset/:token", controller.resetPasswordToken);

    router.post("/reset/:token", controller.resetPasswordPostToken);
    
    app.use('/api/auth', router);
    }

    