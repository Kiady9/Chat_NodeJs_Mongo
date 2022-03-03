//For Register Page
const dashboardView = (req, res) => {
    console.log(req.user.email);
    userJ = req.user.email;

    res.render("dashboard", {
        user: req.user,
    });



};

module.exports = {
    dashboardView,
};