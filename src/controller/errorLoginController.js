const errorLoginController = async (req, res) => {
    const { username } = req.session
    res.render("errorLoginTemplate.ejs", { username })
}
const errorRegisterController = async (req, res) => {
    const { username } = req.session
    res.render("errorRegisterTemplate.ejs", { username })
}

export { errorLoginController, errorRegisterController }