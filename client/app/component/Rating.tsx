import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function Rating() {
  const [rating, setRating] = useState(null);
  return (
    <div className="flex flex-row">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label htmlFor={`star-${ratingValue}`} key={index}>
            <FaStar
              size={40}
              color={ratingValue <= rating ? "black" : "white"}
            />
            <input
              type="radio"
              id={`star-${ratingValue}`}
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
            />
          </label>
        );
      })}
    </div>
  );
}
