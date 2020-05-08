const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//multer for image upload handling
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

//Validation
const { registerValidation, loginValidation } = require('../validation')


router.post('/register',upload.single('profileImage'), async (req, res) => {
    //validate data before sending
    const { error } = registerValidation(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0].message });

    //check user exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
        return res.status(400).json({ message: "Email already exists" });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        profileImage: req.file.path
    });

    try {
        const savedUser = await user.save();
        res.status(200).json({ message: "user created", userID: savedUser._id });
    } catch (err) {
        res.status(400).json({ message: err });
    }
});


router.post('/login', async (req, res) => {
    //validate data before sending
    const { error } = loginValidation(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0].message });

    //check user exists
    const currUser = await User.findOne({ email: req.body.email });
    if (!currUser)
        return res.status(400).json({ message: "Email is not registered with the system" });

    //check password is correct
    const validPass = await bcrypt.compare(req.body.password, currUser.password);
    if (!validPass)
        return res.status(400).json({ message: "Your password is wrong" });

    const token = jwt.sign({ _id: currUser._id }, process.env.TOKENSECRET);

    res.header('auth-token', token);
    res.status(200).json({ message: "login success" });
});



module.exports = router;