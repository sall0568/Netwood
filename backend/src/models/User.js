const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: null,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
      },
    ],
    watchHistory: [
      {
        contentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Content",
        },
        watchedAt: {
          type: Date,
          default: Date.now,
        },
        progress: {
          type: Number, // Pourcentage de visionnage (0-100)
          default: 0,
        },
      },
    ],
    ratings: [
      {
        contentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Content",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        ratedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "dark",
      },
      language: {
        type: String,
        enum: ["fr", "en", "yo", "ig", "ha"],
        default: "fr",
      },
      favoriteGenres: [String],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password avant sauvegarde
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
