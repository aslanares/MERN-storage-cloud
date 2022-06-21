const Router = require("express");
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const config = require("config")
const jwt = require("jsonwebtoken")
const {check, validationResult} = require("express-validator")
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')

router.post('/registration',
    [
        check('username', "Username must be longer than 3 symbols and shorter than 30").isLength({min:3, max:30}),
        check('email', "Incorrect email").isEmail(),
        check('password', 'Password must be longer than 3 symbols and shorter than 12').isLength({min:3, max:12})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: "Incorrect request", errors})
        }
        const {username, email, password} = req.body
        const candidate = await User.findOne({email})
        if(candidate) {
            return res.status(400).json({message: `User with email ${email} already exist`})
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const user = new User({username, email, password: hashPassword})
        await user.save()
        await fileService.createDir(req, new File({user:user.id, name: ''}))
        res.json({message: "User was created"})
    } catch (e) {
        console.log(e)
        res.send({message: "Server error"})
    }
})

router.post('/login',
    async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(404).json({message: "User not found"})
            }
            const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid) {
                return res.status(400).json({message: "Invalid password"})
            }
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
})

router.get('/auth', authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user.id})
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
})

router.post('/changepass',
  [
      check('newPass', 'Password must be longer than 3 symbols and shorter than 12').isLength({min:3, max:12})
  ],
  async (req, res) => {
      try {
          const errors = validationResult(req)
          if (!errors.isEmpty()) {
              return res.status(400).json({message: "Incorrect request", errors})
          }

          const {email, oldPass, newPass, confirmNewPass} = req.body
          const user = await User.findOne({email})

          if (!user) {
              return res.status(404).json({message: "User not found"})
          }
          const isOldPassValid = bcrypt.compareSync(oldPass, user.password)

          if (!isOldPassValid) {
              res.status(400).json({message: "Old password is incorrect"})
          }

          if (!newPass) {
              res.status(400).json({message: "New password is empty"})
          }

          if (isOldPassValid === newPass) {
              res.status(400).json({message: "The new password cannot match the old password"})
          }

          if (confirmNewPass !== newPass) {
              res.status(400).json({message: "The password confirmation is not equal to the new password"})
          }

          if (isOldPassValid && newPass === confirmNewPass) {
              const hashPassword = await bcrypt.hash(newPass, 8)
              user.password = hashPassword
              await user.save()
              res.json({message: "Password was changed"})
          }
      } catch (e) {
          console.log(e)
          res.send({message: "Server error"})
      }
  })

module.exports = router
