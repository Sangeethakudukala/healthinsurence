import React from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import './Homepage.css';

function Homepage() {
  return (
    <div> 
      <Header/>
      <div className="homepage-body">
        <div className="content">
          <h6 className="homepage-heading">
            CHOOSE CONFIDENCE: CHOOSE RAMANASOFT INSURANCE
          </h6>
          <p className="homepage-paragraph">
            Health insurance is a contract between an individual or group and an insurance company that provides financial protection for medical expenses. 
            In exchange for a monthly premium, the insurance company agrees to pay for or reimburse the policyholder for a range of healthcare costs. 
            Health insurance can cover a wide range of medical expenses, including hospital stays, doctor visits, medications, ambulance charges, and more. 
            Health insurance premiums are eligible for tax deductions under Section 80D of the Income Tax Act, 1961. 
            The premium for a health insurance plan can be affected by several factors, including age, gender, family medical history, and lifestyle habits. 
            Some health insurance plans offer cashless treatment at network hospitals, where the insurer takes care of the bills.
          </p>
        </div>

        <div className="image">
          <img className="img-fluid opacity-75 rounded-pill"
            src='https://img.freepik.com/premium-vector/health-insurance-coverage-modern-medicine-patient-fills-out-health-insurance-contract-health-insurance-concept-flat-vector-illustration_923732-4176.jpg?semt=ais_hybrid'
            alt="Health Insurance" 
             width={500} 
            height={450}
          />
        </div>
      </div>

      <div className="help-container">
        <h2 className="help-heading">HAVE A QUESTION? HERE TO HELP</h2>
        <p className="help-description">
          Get quick assistance from RamanaSoft Insurance via phone or email. Whether you have questions, need help with claims, or want to learn about our coverage, our team is here for you. Reach out today for reliable support.
        </p>
        <div className='help-content'>
        <div className="help-contact-options">
          <div className="help-contact-card">
            <h3 className="help-card-title">For General Queries</h3>
            <p className="help-card-info">support@ramanasoft.com</p>
          </div>
          <div className="help-contact-card">
            <h3 className="help-card-title">For Customer Care</h3>
            <p className="help-card-info">1800-143-123</p>
          </div>

{/* <div className="help-contact-card">
  <h3 className="help-card-title">For Customer Care</h3>
  <a href="tel:1800143123" className="help-card-info">1800-143-123</a>
</div> */}

          
        </div>
        <div className="customer-image">
            <img 
              className="customer-support " 
              src="https://img.freepik.com/premium-vector/customer-operator-online-technical-support-concept_1198-830.jpg?semt=ais_hybrid " 
              alt="Customer Support" 
              width={500} height={320}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Homepage;
