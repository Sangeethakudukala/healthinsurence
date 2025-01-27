import FacebookIcon from "@mui/icons-material/Facebook";
// import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { IconButton } from "@mui/material";
  const Footer = () => {
  return (
    <footer className="bottom-0 start-0 w-100 bg-light gray
   text-center py-3">

      <div className="mb-4">
        <p className="mb-0">
          RamanaSoft Insurance Company is a trusted name in insurance, known for
          its tailored solutions and customer-centric approach. With a focus on
          technology and personalized service, RamanaSoft offers a range of
          insurance products for individuals and businesses. Committed to
          excellence and social responsibility, RamanaSoft is a reliable partner
          for protecting what matters most.
        </p>
      </div>
      <div className="d-flex justify-content-center mb-1">
          <IconButton href="https://facebook.com" target="_blank" color="primary">
            <FacebookIcon />
          </IconButton>
          {/* <IconButton href="https://twitter.com" target="_blank" color="primary">
            <TwitterIcon />
          </IconButton> */}     
          <IconButton href="https://twitter.com" target="_blank" color="primary">
  <img
    src="https://allpngfree.com/apf-prod-storage-api/storage/thumbnails/twitter-new-logo-png-transparent-images-thumbnail-1697953256.jpg" // Replace with the official "X" logo URL
    alt="X"
    style={{ width: '24px', height: '24px' }}
  />
</IconButton>

          <IconButton href="https://instagram.com" target="_blank" color="secondary">
            <InstagramIcon />
          </IconButton>
          <IconButton href="https://wa.me" target="_blank" color="success">
            <WhatsAppIcon />
          </IconButton>
        </div>
      <div>
        <p className="mb-0">
          <span className="text-black">© All Rights Reserved 2024. </span>
          <span className="fw-bold text-danger">RamanaSoft</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

