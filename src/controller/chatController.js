
const chatController = (req, res) => {
    const { username } = req.session
    res.render("chatTemplate.ejs", { username })
}

export { chatController }