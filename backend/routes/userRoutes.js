const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const verifyToken = require('../middleware/verifyToken');

dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password, weight, firstName, lastName } = req.body;

  try {
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Ten login jest już zajęty' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Użytkownik z tym emailem już istnieje' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      weight,
      firstName,
      lastName,
    });

    await user.save();

    res.status(201).json({
      message: 'Rejestracja zakończona sukcesem, czekaj na zatwierdzenie przez administratora',
    });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
});



router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body; 

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(400).json({ message: 'Nieprawidłowy login/email lub hasło' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Nieprawidłowy login/email lub hasło' });
    }

    if (!user.isConfirmed) {
      return res.status(403).json({ message: 'Twoje konto nie zostało zatwierdzone przez administratora' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Zalogowano pomyślnie', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
});



router.post('/addResult', verifyToken ,async (req, res) => {
  const { userId, weight, powerliftingSumWeight, points } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    user.results.push({ weight, powerliftingSumWeight, points });

    await user.save();

    res.status(201).json({ message: 'Wynik dodany pomyślnie', results: user.results });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
});



router.get('/getResults', verifyToken ,async (req, res) => {
  const { userId, sortBy, sortOrder = 'asc' } = req.query;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    const validSortFields = ['date', 'weight', 'powerliftingSumWeight', 'points'];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ message: 'Niepoprawne pole sortowania' });
    }

    const order = sortOrder === 'desc' ? -1 : 1;

    const sortedResults = user.results.sort((a, b) => {
      if (sortBy === 'date') {
        return order * (new Date(b.date) - new Date(a.date));
      } else {
        return order * (a[sortBy] - b[sortBy]);
      }
    });

    res.json({ results: sortedResults });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
});


router.post('/logout', verifyToken, async (req, res) => {
  const { userId } = req.body; 

  if (!userId) {
    return res.status(400).json({ message: 'ID użytkownika jest wymagane' });
  }

  try {
    res.json({ message: 'Wylogowano pomyślnie' }); 
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera' }); 
  }
});

module.exports = router;