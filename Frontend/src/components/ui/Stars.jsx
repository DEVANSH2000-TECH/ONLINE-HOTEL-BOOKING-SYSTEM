const Stars = ({ rating }) => {
    const rounded = Math.round(rating);

    return (
        <div style={{ color: "#f59e0b" }}>
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n}>{n <= rounded ? "★" : "☆"}</span>
            ))}
        </div>
    );
};

export default Stars;
