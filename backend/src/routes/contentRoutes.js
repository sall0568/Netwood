const express = require("express");
const {
  search,
  getByCategory,
  getTrending,
  getTrendingMovies,
  getTrendingTVShows,
  getCategories,
  getById,
} = require("../controllers/contentController");
const {
  fetchAndSaveContent,
  seedGenres,
} = require("../services/contentService");
const logger = require("../config/logger");

const router = express.Router();

/**
 * @route   GET /api/content/search
 * @desc    Search for content
 * @access  Public
 */
router.get("/search", search);

/**
 * @route   GET /api/content/category/:categoryType/:categoryValue
 * @desc    Get content by category
 * @access  Public
 */
router.get("/category/:categoryType/:categoryValue", getByCategory);

/**
 * @route   GET /api/content/trending
 * @desc    Get trending content
 * @access  Public
 */
router.get("/trending", getTrending);

/**
 * @route   GET /api/content/trending/movies
 * @desc    Get trending movies
 * @access  Public
 */
router.get("/trending/movies", getTrendingMovies);

/**
 * @route   GET /api/content/trending/tvshows
 * @desc    Get trending TV shows
 * @access  Public
 */
router.get("/trending/tvshows", getTrendingTVShows);

/**
 * @route   GET /api/content/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get("/categories", getCategories);

/**
 * @route   GET /api/content/:id
 * @desc    Get content by ID (MongoDB _id or YouTube videoId)
 * @access  Public
 */
router.get("/:id", getById);

/**
 * @route   POST /api/content/seed
 * @desc    Manually seed the database with content from YouTube
 * @access  Public
 */
router.post("/seed", async (req, res) => {
  try {
    const { query = "Nigerian movies", limit = 20 } = req.body;

    logger.info(
      `Manual seeding requested for query: ${query}, limit: ${limit}`
    );

    // Fetch and save content
    const savedContent = await fetchAndSaveContent(query, limit);

    return res.status(200).json({
      success: true,
      message: `Successfully seeded database with ${savedContent.length} items`,
      count: savedContent.length,
    });
  } catch (error) {
    logger.error(`Error in manual seeding: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

/**
 * @route   POST /api/content/seed/genres
 * @desc    Seed the database with content for each genre to ensure minimum content availability
 * @access  Public
 */
router.post("/seed/genres", async (req, res) => {
  try {
    const { resultsPerGenre = 15 } = req.body;

    logger.info(
      `Genre-specific seeding requested (${resultsPerGenre} items per genre)`
    );

    // Seed genres
    const results = await seedGenres(resultsPerGenre);

    return res.status(200).json({
      success: true,
      message: `Successfully seeded genres with target of ${resultsPerGenre} items per genre`,
      results,
    });
  } catch (error) {
    logger.error(`Error in genre seeding: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

/**
 * @route   POST /api/content/seed/french
 * @desc    Seed the database with French Nigerian movies
 * @access  Public
 */
router.post("/seed/french", async (req, res) => {
  try {
    const frenchQueries = [
      "Film nigérian en français",
      "Nollywood film français complet",
      "Film africain nigérian français",
      "Nollywood doublé français",
      "Film nigérian 2024 français",
    ];

    logger.info("French content seeding requested");

    let totalSaved = 0;
    const results = [];

    for (const query of frenchQueries) {
      try {
        const savedContent = await fetchAndSaveContent(query, 15);
        totalSaved += savedContent.length;
        results.push({ query, count: savedContent.length });
        logger.info(`Seeded ${savedContent.length} items for query: ${query}`);

        // Wait a bit between requests to avoid API rate limits
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        logger.error(`Error seeding query "${query}": ${error.message}`);
        results.push({ query, count: 0, error: error.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Successfully seeded database with ${totalSaved} French items`,
      totalCount: totalSaved,
      results,
    });
  } catch (error) {
    logger.error(`Error in French seeding: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

module.exports = router;
