const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class authController {
    async registration(req, res) {
        console.log('Request body:', req.body);
        try {
            const { login, password, fullName, email } = req.body;

            console.log('Checking for existing user...');
            const existingUser = await User.findByLogin(login);
            console.log('Existing user:', existingUser);

            if (existingUser) {
                console.log('User already exists');
                return res.status(400).send('User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            console.log('Creating new user...');
            await User.create(login, hashedPassword, fullName, email);

            console.log('User registered successfully');
            res.status(201).send('User registered successfully');
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).send('Server error');
        }
    }
  async login(req, res) {
    console.log('Login request body:', req.body);
    const { login, password } = req.body;

    try {
        const user = await User.findByLogin(login);

        if (!user) {
            console.log('Invalid login');
            return res.status(400).send('Invalid login');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Invalid password');
            return res.status(400).send('Invalid password');
        }

        console.log('Login successful');
        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                loginUser: user.login,
                fullName: user.full_name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).send('Server error');
    }
}

}

module.exports = new authController();