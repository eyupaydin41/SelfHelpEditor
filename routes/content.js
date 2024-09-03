const express = require('express');
const router = express.Router();
const Section = require('../models/section');
const Step = require('../models/step');
const Therapy = require('../models/therapy');
const Podcast = require('../models/podcast');
const Exercise = require('../models/exercise');
const ExerciseStep = require('../models/exerciseStep');
const Post = require('../models/post');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/my-therapies', authenticateToken, async (req, res) => {
    try {
        const therapies = await Therapy.find({ creator: req.user.userId });

        res.status(200).json({ therapies });
    } catch (error) {
        console.error('Error fetching user therapies:', error);
        res.status(500).json({ message: 'Bir hata oluştu!', error });
    }
});

router.post('/therapies', authenticateToken, async (req, res) => {
    try {
        const { title, description, imageUrl, cardImageUrl, sections } = req.body;

        const therapy = new Therapy({
            title,
            description,
            imageUrl,
            cardImageUrl,
            creator: req.user.userId
        });

        await therapy.save();

        if (sections && sections.length > 0) {
            for (let section of sections) {
                const newSection = new Section({
                    title: section.title,
                    therapy: therapy._id,
                    creator: req.user.userId
                });
                await newSection.save();

                if (section.steps && section.steps.length > 0) {
                    for (let step of section.steps) {
                        const newStep = new Step({
                            title: step.title,
                            content: step.content,
                            section: newSection._id,
                            creator: req.user.userId
                        });
                        await newStep.save();
                    }
                }
            }
        }

        res.status(201).json({ message: 'Terapi ve ilgili bölümler/adımlar başarıyla eklendi!', therapy });
    } catch (error) {
        console.error('Error creating therapy:', error);
        res.status(500).json({ message: 'Bir hata oluştu!', error });
    }
});

router.get('/my-podcasts', authenticateToken, async (req, res) => {
    try {
        const podcasts = await Podcast.find({ creator: req.user.userId });

        res.status(200).json({ podcasts });
    } catch (error) {
        console.error('Error fetching user podcasts:', error);
        res.status(500).json({ message: 'Bir hata oluştu!', error });
    }
});

router.post('/podcasts', authenticateToken, async (req, res) => {
    try {
        const { title, description, cardImageUrl, imageUrl, source } = req.body;

        const podcast = new Podcast({
            title,
            description,
            cardImageUrl,
            imageUrl,
            source,
            creator: req.user.userId
        });

        await podcast.save();

        res.status(201).json({ message: 'Podcast başarıyla eklendi!', podcast });
    } catch (error) {
        console.error('Error creating podcast:', error);
        res.status(500).json({ message: 'Bir hata oluştu!', error });
    }
});

router.get('/my-exercises', authenticateToken, async (req, res) => {
    try {
        const exercises = await Exercise.find({ creator: req.user.userId });

        res.status(200).json({ exercises });
    } catch (error) {
        console.error('Error fetching user exercises:', error);
        res.status(500).json({ message: 'Bir hata oluştu!', error });
    }
});

router.post('/exercises', authenticateToken, async (req, res) => {
    try {
        const { name, description, imageUrl, cardImageUrl, steps } = req.body;

        const exercise = new Exercise({
            name,
            description,
            imageUrl,
            cardImageUrl,
            creator: req.user.userId
        });

        await exercise.save();

        if (steps && steps.length > 0) {
            for (let step of steps) {
                const newExerciseStep = new ExerciseStep({
                    source: step.source,
                    stepDescription: step.stepDescription,
                    exercise: exercise._id,
                    creator: req.user.userId
                });
                await newExerciseStep.save();
            }
        }

        res.status(201).json({ message: 'Egzersiz ve ilgili adımlar başarıyla eklendi!', exercise });
    } catch (error) {
        console.error('Error creating exercise:', error);
        res.status(500).json({ message: 'Bir hata oluştu!', error });
    }
});

router.get('/my-posts', authenticateToken, async (req, res) => {
    try {
        const posts = await Post.find({ creator: req.user.userId });

        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: 'Bir hata oluştu!', error });
    }
});


router.post('/posts', authenticateToken, async (req, res) => {
    try {
        const { title, description, imageUrl, cardImageUrl, source } = req.body;

        const post = new Post({
            title,
            description,
            imageUrl,
            cardImageUrl,
            source,
            creator: req.user.userId
        });

        await post.save();

        res.status(201).json({ message: 'Post başarıyla eklendi!', post });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Bir hata oluştu!', error });
    }
});

router.get('/unapproved-contents', async (req, res) => {
    try {
        // Pending içeriklerin her model için ayrı ayrı sorgulanması
        const unapprovedExercises = await Exercise.find({ status: 'pending' })
            .populate('creator', 'username')
            .select('_id name creator createdAt');

        const unapprovedPodcasts = await Podcast.find({ status: 'pending' })
            .populate('creator', 'username')
            .select('_id title creator createdAt');

        const unapprovedPosts = await Post.find({ status: 'pending' })
            .populate('creator', 'username')
            .select('_id title creator createdAt');

        const unapprovedTherapies = await Therapy.find({ status: 'pending' })
            .populate('creator', 'username')
            .select('_id title creator createdAt');

        // İçerikleri türlerine göre düzenleme
        const unapprovedContents = [
            ...unapprovedExercises.map(content => ({
                _id: content._id,
                type: 'Exercise',
                title: content.name,
                creator: content.creator.username,
                createdAt: content.createdAt
            })),
            ...unapprovedPodcasts.map(content => ({
                _id: content._id,
                type: 'Podcast',
                title: content.title,
                creator: content.creator.username,
                createdAt: content.createdAt
            })),
            ...unapprovedPosts.map(content => ({
                _id: content._id,
                type: 'Post',
                title: content.title,
                creator: content.creator.username,
                createdAt: content.createdAt
            })),
            ...unapprovedTherapies.map(content => ({
                _id: content._id,
                type: 'Therapy',
                title: content.title,
                creator: content.creator.username,
                createdAt: content.createdAt
            })),
        ];

        // createdAt alanına göre sıralama
        const sortedContents = unapprovedContents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json(sortedContents);
    } catch (error) {
        console.error('Error fetching unapproved contents:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Güncelleme Endpointi
router.put('/exercise/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedExercise = await Exercise.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedExercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        res.status(200).json(updatedExercise);
    } catch (error) {
        console.error('Error updating exercise:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Silme Endpointi
router.delete('/exercise/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExercise = await Exercise.findByIdAndDelete(id);

        if (!deletedExercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        res.status(200).json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        console.error('Error deleting exercise:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Güncelleme Endpointi
router.put('/podcast/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPodcast = await Podcast.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedPodcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }

        res.status(200).json(updatedPodcast);
    } catch (error) {
        console.error('Error updating podcast:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Silme Endpointi
router.delete('/podcast/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPodcast = await Podcast.findByIdAndDelete(id);

        if (!deletedPodcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }

        res.status(200).json({ message: 'Podcast deleted successfully' });
    } catch (error) {
        console.error('Error deleting podcast:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Güncelleme Endpointi
router.put('/post/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Silme Endpointi
router.delete('/post/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Güncelleme Endpointi
router.put('/therapy/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTherapy = await Therapy.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedTherapy) {
            return res.status(404).json({ message: 'Therapy not found' });
        }

        res.status(200).json(updatedTherapy);
    } catch (error) {
        console.error('Error updating therapy:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Silme Endpointi
router.delete('/therapy/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTherapy = await Therapy.findByIdAndDelete(id);

        if (!deletedTherapy) {
            return res.status(404).json({ message: 'Therapy not found' });
        }

        res.status(200).json({ message: 'Therapy deleted successfully' });
    } catch (error) {
        console.error('Error deleting therapy:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = router;
