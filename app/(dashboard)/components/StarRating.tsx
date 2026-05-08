interface StarRatingProps {
  rating: number;
}

export function StarRating({ rating }: StarRatingProps) {
  const totalStars = 5;
  return (
    <div className="flex">
      {Array.from({ length: totalStars }).map((_, i) => (
        <span
          key={i}
          style={{
            color: i < rating ? "#FACC15" : "#D1D5DB", // yellow & gray
            marginRight: "2px",
            fontSize: "18px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
