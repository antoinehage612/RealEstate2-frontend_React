import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";
import "./profileUpdatePage.scss";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const filePickerRef = useRef(null);

  // States for image upload
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(
    currentUser.avatar ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4k-EK9bwaXD1R_HGLkKam2lQJBpUZ6BB-5iWwW0nUXQ&s"
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;

    const storage = getStorage(app);
    const fileName = currentUser.id + "-" + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setUploadError(error.message);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageURL(downloadURL);
          // Update the user's avatar URL in the database
          await apiRequest.put(`/users/${currentUser.id}`, {
            avatar: downloadURL,
          });
        } catch (error) {
          console.error("Error updating user avatar URL:", error);
        }
      }
    );
  };

  const handleAvatarClick = () => {
    filePickerRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const updatedUserData = { username, email, password };

      if (imageFile) {
        await handleUpload();
        updatedUserData.avatar = imageURL;
      }

      const res = await apiRequest.put(
        `/users/${currentUser.id}`,
        updatedUserData
      );
      updateUser(res.data);

      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
        </form>
      </div>
      <div className="sideContainer">
        <div className="item" onClick={handleAvatarClick}>
          <input
            type="file"
            accept="image/*"
            ref={filePickerRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <img src={imageURL} alt="Avatar" className="avatar" />
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
