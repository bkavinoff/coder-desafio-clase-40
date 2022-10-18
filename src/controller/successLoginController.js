
const successLoginController = (req, res) => {
    console.log('successLoginController --> session.user.username: ', req.session.usermane)

    console.log('successLoginController: ...')
    //res.redirect("/api/products/all")
    console.log('successLoginController: OK')
}

export { successLoginController }