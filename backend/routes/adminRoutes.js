import express from 'express'
import User from '../models/user.js'
import dotenv from 'dotenv'
import verifyToken from '../middleware/verifyToken.js'

dotenv.config()

const router = express.Router()

const isAdmin = async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(403).json({ message: 'Brak uprawnień' });
  }

  try {
    const user = await User.findById(userId);
    if (user && user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Błąd serwera' });
  }
};

router.get('/unconfirmed', verifyToken, isAdmin, async (req, res) => {
	try {
		const users = await User.find({ isConfirmed: false })

		if (users.length === 0) {
			return res.status(404).json({ message: 'Brak niepotwierdzonych użytkowników' })
		}

		res.json({ users })
	} catch (error) {
		res.status(500).json({ message: 'Błąd serwera' })
	}
})

router.put('/confirmUser', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    user.isConfirmed = true;
    user.confirmedAt = Date.now();
    await user.save();

    res.json({ message: 'Użytkownik zatwierdzony' });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

router.get('/bestResults', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ isConfirmed: true }).select('username firstName lastName email results');
    
    if (!users.length) {
      return res.status(404).json({ message: 'No confirmed users found' });
    }

    const usersWithBestResult = users.map(user => {
      if (!user.results || user.results.length === 0) {
        return {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          bestResult: null,
        };
      }

      // Znajdź najlepszy wynik (np. z najwyższymi punktami, jeśli inne pola równe)
      const bestResult = user.results.reduce((best, current) =>
        current.points > best.points ? current : best
      );

      return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bestResult: {
          weight: bestResult.weight,
          powerliftingSumWeight: bestResult.powerliftingSumWeight,
          points: bestResult.points,
          date: new Date(bestResult.date).toLocaleDateString('pl-PL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        },
      };
    });

    res.json({ users: usersWithBestResult }); // Wysyłamy posortowane obiekty, ale kolejność zostawiamy frontendowi
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



router.get('/confirmedUsers', verifyToken, isAdmin, async (req, res) => {
	try {
		const users = await User.find({ isConfirmed: true }).select(
			'firstName lastName username email _id confirmedAt createdAt'
		)

		if (!users.length) {
			return res.status(404).json({ message: 'Brak użytkowników z potwierdzonymi kontami' })
		}

		res.json({ users })
	} catch (error) {
		res.status(500).json({ message: 'Błąd serwera' })
	}
})

router.delete('/deleteUser', verifyToken, isAdmin, async (req, res) => {
	const { id } = req.body

	if (!id) {
		return res.status(400).json({ message: 'User ID is required' })
	}

	try {
		const user = await User.findByIdAndDelete(id)

		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		res.json({ message: 'User has been deleted successfully' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Server error' })
	}
})

export default router
