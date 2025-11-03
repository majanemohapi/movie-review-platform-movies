import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const addReview = async () => {
  try {
    await addDoc(collection(db, "reviews"), {
      title: "Inception",
      type: "movie",
      rating: 5,
      review: "Mind-blowing!",
      user: "Jane Doe",
      date: new Date()
    });
    alert("Review added!");
  } catch (error) {
    console.error("Error adding review: ", error);
  }
};
export default addReview;