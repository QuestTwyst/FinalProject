import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        return {
          email: user.email || "",
          firstName: user.first_name || user.firstName || "",
          middleName: user.middle_name || user.middleName || "",
          lastName: user.last_name || user.lastName || "",
          favoriteGenre: user.favorite_genre || user.favoriteGenre || "",
          bio: user.bio || "",
        };
      } catch (error) {
        console.error("Could not load profile:", error);
      }
    }

    return {
      email: "",
      firstName: "",
      middleName: "",
      lastName: "",
      favoriteGenre: "",
      bio: "",
    };
  });

  const [originalEmail, setOriginalEmail] = useState(profile.email);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [readingProgress, setReadingProgress] = useState([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    const fetchReadingProgress = async () => {
      const savedUser = localStorage.getItem("currentUser");
      const currentUser = savedUser ? JSON.parse(savedUser) : null;

      if (!currentUser?.id) {
        setIsLoadingProgress(false);
        return;
      }

      try {
        setIsLoadingProgress(true);
        setProgressError("");

        const authToken = localStorage.getItem("authToken");
        const response = await fetch(
          `${API_BASE_URL}/api/progress/${currentUser.id}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          },
        );

        if (!response.ok) {
          throw new Error("Could not load reading progress.");
        }
        const data = await response.json();

        const progressList = Array.isArray(data) ? data : data.progress || [];

        setReadingProgress(progressList);
      } catch (error) {
        console.error("Progress error:", error);
        setProgressError("Unable to load your saved stories.");
      } finally {
        setIsLoadingProgress(false);
      }
    };
    fetchReadingProgress();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError("");

    const savedUser = localStorage.getItem("currentUser");
    const currentUser = savedUser ? JSON.parse(savedUser) : null;

    if (!currentUser || !currentUser.id) {
      setSaveError("You need to be logged in to update your profile.");
      return;
    }

    setIsSaving(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
        method: "PATCH",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          email: profile.email.trim(),
          first_name: profile.firstName.trim(),
          middle_name: profile.middleName.trim(),
          last_name: profile.lastName.trim(),
          favorite_genre: profile.favoriteGenre,
          bio: profile.bio.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSaveError(
          data.error || "Something went wrong updating your profile.",
        );
        return;
      }

      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      setProfile({
        email: updatedUser.email || "",
        firstName: updatedUser.first_name || "",
        middleName: updatedUser.middle_name || "",
        lastName: updatedUser.last_name || "",
        favoriteGenre: updatedUser.favorite_genre || "",
        bio: updatedUser.bio || "",
      });

      setOriginalEmail(updatedUser.email || "");
      setIsEditing(false);
    } catch (error) {
      setSaveError("Could not reach the server. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim() || "Reader";

  return (
    <main className="profile-page">
      <nav className="profile-nav">
        <Link to="/" className="library-btn" aria-label="Back to home">
          Home
        </Link>

        <Link to="/library" className="library-btn">
          Library
        </Link>

        <Link
          to="/profile"
          className="nav-btn profile-icon-btn"
          aria-label="Open profile"
        >
          👤
        </Link>
      </nav>

      <section className="profile-card">
        <div className="profile-avatar">
          {profile.firstName.charAt(0).toUpperCase()}
          {profile.lastName.charAt(0).toUpperCase()}
        </div>

        <h1>My Profile</h1>

        {saveError && <p className="field-error">{saveError}</p>}

        {!isEditing ? (
          <div className="profile-information">
            <div className="profile-field">
              <span>Name</span>
              <p>{fullName}</p>
            </div>

            <div className="profile-field">
              <span>Email</span>
              <p>{profile.email || "Not provided"}</p>
            </div>

            <div className="profile-name-grid">
              <div className="profile-field">
                <span>First name</span>
                <p>{profile.firstName || "Not provided"}</p>
              </div>

              <div className="profile-field">
                <span>Last name</span>
                <p>{profile.lastName || "Not provided"}</p>
              </div>
            </div>

            <div className="profile-field">
              <span>Favorite genre</span>
              <p>{profile.favoriteGenre || "Not selected"}</p>
            </div>

            <div className="profile-field">
              <span>Bio</span>
              <p>{profile.bio || "No bio added yet."}</p>
            </div>

            <button
              type="button"
              className="edit-profile-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="text"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </label>

            <div className="profile-name-grid">
              <label>
                First name
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Last name
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label>
              Favorite genre
              <select
                name="favoriteGenre"
                value={profile.favoriteGenre}
                onChange={handleChange}
                required
              >
                <option value="">Select a genre</option>
                <option value="Adventure">Adventure</option>
                <option value="Comedy">Comedy</option>
                <option value="Horror">Horror</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Western">Western</option>
              </select>
            </label>

            <label>
              Bio
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell readers about yourself"
              />
            </label>

            <div className="profile-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>

              <button type="submit" className="save-button" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="continue-section">
        <h2>Continue Reading</h2>

        {isLoadingProgress && (
          <p className="progress-message">Loading your saved stories...</p>
        )}

        {!isLoadingProgress && progressError && (
          <p className="progress-error">{progressError}</p>
        )}

        {!isLoadingProgress &&
          !progressError &&
          readingProgress.length === 0 && (
            <div className="empty-progress-card">
              <h3>No saved stories yet</h3>

              <p>Start reading a story and your progress will appear here.</p>
              <Link to="/library" className="browse-stories-button">
                Browse Stories
              </Link>
            </div>
          )}

        {!isLoadingProgress && !progressError && readingProgress.length > 0 && (
          <div className="progress-grid">
            {readingProgress.map((item) => {
              const storyId = item.storyId || item.story_id;

              const storyTitle =
                item.storyTitle ||
                item.story_title ||
                item.title ||
                "Untitled Story";

              const currentPassage =
                item.currentPassage ||
                item.current_passage ||
                item.passageId ||
                item.passage_id;
              return (
                <article
                  className="progress-card"
                  key={item.id || `${storyId}-${currentPassage}`}
                >
                  <h3>{storyTitle}</h3>

                  {item.genre && <p className="story-genre">{item.genre}</p>}
                  <Link
                    to={`/stories/${storyId}`}
                    state={{ resumePassageId: currentPassage }}
                    className="continue-button"
                  >
                    Continue Reading
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Profile;
