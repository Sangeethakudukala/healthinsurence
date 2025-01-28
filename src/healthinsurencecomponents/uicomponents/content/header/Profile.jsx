import React, { useEffect, useState } from 'react';
import { Button, FormControl, FormControlLabel, Radio, RadioGroup, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import p1 from '../../../images/p3.jpeg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FacebookIcon from '@mui/icons-material/Facebook';
// import TwitterIcon from '@mui/icons-material/Twitter';
// import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import './Profile.css';


const Profile = () => {
  const [insuranceType, setInsuranceType] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (event) => {
    setInsuranceType(event.target.value);
  };

  const handleNextClick = () => {
    console.log(`Selected insurance type: ${insuranceType}`);
    navigate('/next-page');
  };

  const [costumerdetails,setcustomerdetails]=useState([]);

  
   
  const value = Cookies.get("MobileNumber");
  //  console.log(value);


    // useEffect(()=>{
    //   // axios.get('http://183.82.106.55:9100/register/fetch/'+Value).then((res)=>{
    //   //   console.log(res);
    //   // })
    //   axios.get(``).then((res)=>{console.log(res)})
    // },[value]) 

    useEffect(()=>{
      axios.get('http://183.82.106.55:9100/register/fetch/'+value).then((res)=>{
        // console.log(res.data);
        setcustomerdetails(res.data);
      },[value])
    });
    
    // console.log(costumerdetails.fullName);
     Cookies.set("UserDetails",costumerdetails.gender);
    // console.log(Cookies.get('UserDetails'))
    Cookies.set('insuranceType',insuranceType);
    // console.log(Cookies.get('insuranceType'))
    // console.log(insuranceType)


    // const username = costumerdetails.fullName;

    const username = costumerdetails.fullName
  ? costumerdetails.fullName.charAt(0).toUpperCase() + costumerdetails.fullName.slice(1)
  : '';

  return (
    <div className="app-container d-flex flex-column" style={{ minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand">
            <img src={p1} alt="Company Logo" className="logo" style={{ height: '45px' }} />
          </a>
          <div className="d-flex align-items-center">
            <AccountCircleIcon fontSize="large" className="text-dark" />
          </div>
        </div>
      </nav>

      <div
        className="container flex-grow-1 d-flex align-items-start"
        style={{
          marginTop: '8rem',
        }}
      >
        <div className="w-50 pe-3">
          <Typography variant="h4" className="mb-3 fw-bold">
            Hello, {username} !
          </Typography>
          <div className="d-flex align-items-center">
            <Typography variant="h6" className="mb-0 me-3">
              Select Insurance Type:
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="insurance-type"
                name="insurance-type"
                value={insuranceType}
                onChange={handleChange}
              >
                <FormControlLabel value="Family" control={<Radio />} label="Family" />
                <FormControlLabel value="Individual" control={<Radio />} label="Individual" />
              </RadioGroup>
            </FormControl>
          </div>
          <Button
            variant="contained"
            color="primary"
            className="mt-3"
            onClick={handleNextClick}
            disabled={!insuranceType}
          >
            Next
          </Button>
        </div>

        <div className="d-flex justify-content-center align-items-center gap-4 mt-0">
          <div className="text-center">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/029/152/696/small_2x/rear-view-of-happy-family-father-mother-daughter-and-son-enjoying-beautiful-landscape-and-running-in-a-field-at-sunset-generative-ai-illustration-photo.jpg"
              alt="Right Side Illustration"
              className="img-fluid"
              style={{
                maxWidth: '350px',
                maxHeight: '600px',
                objectFit: 'cover',
                border: '1px solid #ddd',
                borderRadius: '6px',
                marginBottom: '100px',
              }}
            />
          </div>

          <div className="text-center">
            <img
              src="https://thumbs.dreamstime.com/b/doctor-working-virtual-screen-medical-technology-concept-90219055.jpg"
              alt="Left Side Illustration"
              className="img-fluid"
              style={{
                maxWidth: '300px',
                maxHeight: '800px',
                objectFit: 'cover',
                border: '1px solid #ddd',
                borderRadius: '6px',
                marginBottom: '100px',
              }}
            />
          </div>
        </div>
      </div>

      <div className="container text-start d-flex align-items-center">
        <div className="align-items-center justify-content-center">
          <Typography variant="h5" className="fw-bold mb-3">
            Individual health insurance
          </Typography>
          <Typography variant="body1" className="text-muted  mb-4"  style={{ maxWidth: '1300px', textAlign: 'justify' }}>
            Covers a single person's medical bills and hospitalization costs. You can buy an individual plan for
            yourself, your spouse, children, or parents. This is a good option if you don't need to cover family
            members. Your family's well-being is paramount. Choosing the right family health insurance plan is an
            essential step towards securing their future. By considering your family's medical needs, thoroughly
            understanding the policy details, and comparing various options, you can ensure your loved ones are
            protected against unforeseen medical situations. Embrace the peace of mind that comes with knowing your
            family is covered – choose family health insurance, the shield that safeguards your loved ones.
          </Typography>
        </div>
      </div>

      <div className="container text-start d-flex align-items-center">
        <div className="align-items-center justify-content-center">
          <Typography variant="h5" className="fw-bold mb-3">
            Family health insurance
          </Typography>
          <Typography variant="body1" className="text-muted mb-4" style={{ maxWidth: '1300px', textAlign: 'justify' }}>
            Covers the medical expenses of the entire family, including major and minor expenses. This is a good option
            if you have a family to cover. Buying individual insurance for each family member. Health insurance exists
            in a variety of shapes and sizes, but their main goal is to give the policyholder adequate financial
            coverage against rising medical inflation. When it comes to individual health insurance coverage and family
            health plan, there are some differences. Let’s discuss how they work to determine which plan is more
            suitable for you!...Health insurance exists in a variety of shapes and sizes, but their main goal is to give the policyholder adequate financial coverage against rising medical inflation.
          </Typography>
        </div>
      </div>

      <footer
        className="bg-light text-center py-1 mt-5"
        style={{
          bottom: 0,
          width: '100%',
        }}
      >
        <div className="d-flex justify-content-center mb-2">
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
          © All Rights Reserved 2024. <span className="text-danger fw-bold">RamanaSoft</span>
        </p>
      </footer>
    </div>
  );
};

export default Profile;
