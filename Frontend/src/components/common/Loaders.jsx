const Loader = ({ text = "Loading..." }) => {
    return (
        <div style={{
            padding: "3rem",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "1.1rem"
        }}>
            <div style={{
                marginBottom: "0.5rem",
                fontSize: "1.5rem"
            }}>
                ⏳
            </div>
            {text}
        </div>
    );
};

export default Loader;
