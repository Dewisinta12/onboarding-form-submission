const router = require("express").Router();


const STEPS = [
  [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
    },
    {
      name: "bio",
      label: "Bio",
      type: "multiline-text",
    },
  ],
  [
    {
      name: "country",
      label: "Country",
      type: "text",
      required: true,
    },
    {
      name: "receiveNotifications",
      label:
        "I would like to receive email notifications for new messages when I'm logged out",
      type: "yes-no",
      required: true,
    },
    {
      name: "receiveUpdates",
      label: "I would like to receive updates about the product via email",
      type: "yes-no",
      required: true,
    },
  ],
];

// --- Helper function untuk menolak method selain yang diizinkan ---
const methodNotAllowed = (req, res, next) => {
  return res.header("Allow", "GET, POST").sendStatus(405);
};

// --- GET: Ambil step onboarding ---
const getOnboarding = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    return res.status(200).json({ steps: STEPS });
  } catch (error) {
    next(error);
  }
};

// --- POST: Simpan onboarding data ---
const saveOnboarding = async (req, res, next) => {
  try {
    // Cek apakah user sudah login
    if (!req.user) {
      return res.sendStatus(401); // Unauthorized
    }

    const { steps } = req.body;

    // Validasi request body
    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({ message: "Invalid request body format" });
    }

    // Gabungkan semua field dari setiap step
    const fields = steps.flat();

    // Ubah array of objects ke object key-value
    const onboardingData = {};
    fields.forEach((field) => {
      onboardingData[field.name] = field.value;
    });

    // Simulasi data user yang diupdate (anggap sudah login)
    const updatedUser = {
      id: req.user.id || 1,
      username: req.user.username || "username",
      email: req.user.email || "test@test.com",
      firstName: onboardingData.firstName || "",
      lastName: onboardingData.lastName || "",
      bio: onboardingData.bio || "",
      country: onboardingData.country || "",
      receiveNotifications: onboardingData.receiveNotifications || false,
      receiveUpdates: onboardingData.receiveUpdates || false,
      photoUrl: "https://www.test.com/some.jpg",
      completedOnboarding: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Return data user tanpa password
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// --- Route setup ---
router
  .route("/")
  .get(getOnboarding)
  .post(saveOnboarding)
  .all(methodNotAllowed);

module.exports = router;
