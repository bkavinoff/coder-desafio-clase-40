const logOutController = async (req, res) => {
    req.session.destroy()

    res.render("logoutTemplate.ejs")
}

export { logOutController }