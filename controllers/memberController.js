let memberController = module.exports;

memberController.home = (req, res) => {
        console.log("GET const.home");
        res.send("home sahifasidasiz");
};
memberController.signup = (req, res) => {
        console.log("POST const.signup");
        res.send("signup sahifadasiz");
};
memberController.login = (req, res) => {
        console.log("POST const.login");
        res.send("login sahifasidasiz");
};
memberController.logout = (req, res) => {
        console.log("GET const.logout");
        res.send("logout sahifasidasiz");
};