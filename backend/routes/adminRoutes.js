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
	const { sortBy } = req.query; // Use req.query instead of req.body for GET requests

	const sortOptions = ['weight', 'powerliftingSumWeight', 'date', 'points'];
	const sortField = sortOptions.includes(sortBy) ? sortBy : 'date';

	try {
			const users = await User.find({ isConfirmed: true }).select('username firstName lastName email results');

			if (!users.length) {
					return res.status(404).json({ message: 'Brak użytkowników z potwierdzonymi kontami' });
			}

			// Sort each user's results individually
			users.forEach(user => {
					user.results.sort((a, b) => {
							if (sortField === 'date') {
									return new Date(b.date) - new Date(a.date);
							}
							return b[sortField] - a[sortField];
					});
			});

			res.json({ users });
	} catch (error) {
			console.error('Error fetching best results:', error);
			res.status(500).json({ message: 'Błąd serwera' });
	}
});

router.get('/confirmedUsers', verifyToken, isAdmin, async (req, res) => {
	try {
			const users = await User.find({ isConfirmed: true }).select(
					'firstName lastName username email _id confirmedAt createdAt'
			);

			if (!users.length) {
					return res.status(404).json({ message: 'Brak użytkowników z potwierdzonymi kontami' });
			}

			res.json({ users });
	} catch (error) {
			res.status(500).json({ message: 'Błąd serwera' });
	}
});

router.delete('/deleteUser', verifyToken, isAdmin, async (req, res) => {
	const { id } = req.body;

	if (!id) {
			return res.status(400).json({ message: 'User ID is required' });
	}

	try {
			const user = await User.findByIdAndDelete(id);

			if (!user) {
					return res.status(404).json({ message: 'User not found' });
			}

			res.json({ message: 'User has been deleted successfully' });
	} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server error' });
	}
});

export default router
