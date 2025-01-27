
import React from 'react';
import FacebookIcon from "@mui/icons-material/Facebook";
// import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { IconButton } from "@mui/material";

function Footer() {
  return (
    <div>
      <footer
        className="bg-light text-center py-3  mb-1 mt-1 position-0"
        style={{
          width: "100%", /* Ensure the footer spans full width */
          padding: "10px 0", /* Optional: Padding for better spacing */
        }}
      >
        <div className="d-flex justify-content-center mb-0">
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
        <p>
          © All Rights Reserved 2024.{" "}
          <span className="text-danger fw-bold">RamanaSoft</span>
        </p>
      </footer>
    </div>
  );
}

export default Footer;
