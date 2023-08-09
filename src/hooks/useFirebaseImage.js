import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";

const useFirebaseImage = (
  getValues,
  setValue,
  imageName = null,
  callback = null
) => {
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState("");
  if (!getValues || !setValue) return;
  const handleUploadImage = (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            console.log("Nothing");
        }
      },
      (error) => {
        console.log("Error");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImage(downloadURL);
        });
      }
    );
  };
  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setValue("imageName", file.name);
    handleUploadImage(file);
  };
  const handleDeleteImage = () => {
    const storage = getStorage();
    const imageRef = ref(
      storage,
      "images/" + (imageName || getValues("imageName"))
    );
    deleteObject(imageRef)
      .then(() => {
        console.log("Delete image successfully");
        setImage("");
        setProgress(0);
        callback && callback();
      })
      .catch((error) => {
        console.log("Can not delete image");
        setImage("");
      });
  };
  const handleResetUpload = () => {
    setImage("");
    setProgress(0);
  };
  return {
    progress,
    image,
    setImage,
    handleSelectImage,
    handleDeleteImage,
    handleResetUpload,
  };
};
export default useFirebaseImage;
