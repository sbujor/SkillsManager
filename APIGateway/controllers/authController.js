const AuthController = function () {
    function AuthController() {}

    AuthController.prototype.auth = async (req, res, next) => {
        return new Promise(async (resolve, reject) => {
            resolve(res.status(200).send('AAA'));
        });
    };
};

let authController = new AuthController();

export default authController;
