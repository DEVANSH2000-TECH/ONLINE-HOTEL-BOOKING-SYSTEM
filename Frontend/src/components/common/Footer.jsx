import "../../styles/footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            © {new Date().getFullYear()} HotelBooking. All rights reserved.
        </footer>
    );
};

export default Footer;
