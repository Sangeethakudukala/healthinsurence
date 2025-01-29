import React, { useState, useEffect } from "react";
import Nav from "../../nav/Nav";
import Footer from "../../nav/Footer";
import "./Quotation.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios';
import Cookies from 'js-cookie';

const Quotation = () => {
  const [sumAssured, setSumAssured] = useState(500000);
  const [age, setAge] = useState(""); // Start with an empty string for user input
  const [preExisting, setPreExisting] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("1 Year");
  const [initialPremium, setInitialPremium] = useState(0);
  const [finalPremium, setFinalPremium] = useState(0);
  const [preExistingAmount, setPreExistingAmount] = useState(0);
  const [costumerdetails, setCustomerdetails] = useState([]);
  const [data, setData] = useState();
  
  const ageData = useSelector((state) => state.relations.age); // This is an array of age ranges
  const relationData = useSelector((state) => state.relations.selectedRelations);
  const diseaseData = useSelector((state) => state.relations.disease);
   // Get the first element in the array (assuming ageData contains age ranges as strings)
   const selectedAge = ageData[0] ? ageData[0].Age : 0;
  
  const navigate = useNavigate();
  const handleProceedClick = () => {
    // Show the alert
    alert(
      `Proceeding with ${selectedDuration} premium: ₹${getPremiumForDuration(
        selectedDuration === "1 Year"
          ? 1
          : selectedDuration === "2 Years"
          ? 2
          : 3
      ).toLocaleString()}`
    );
    
    // After the alert is dismissed, navigate to the next page
    navigate('/review'); // Replace '/next-page' with the desired target path
  };
  
  const value = Cookies.get("MobileNumber");

  // Fetch customer details
  useEffect(() => {
    axios.get('http://183.82.106.55:9100/register/fetch/' + value).then((res) => {
      setCustomerdetails(res.data);
    });
  }, [value]);

  const username = costumerdetails.fullName
    ? costumerdetails.fullName.charAt(0).toUpperCase() + costumerdetails.fullName.slice(1)
    : '';
  const customerId = costumerdetails.customerId || 'Not Available';

  // Calculate base rate based on age
  const calculateBaseRate = (selectedAge) => {
    let baseRate = 0;
    if (selectedAge <= 30) {
      baseRate = 1; // 1% for age 0-30
    } else if (selectedAge <= 35) {
      baseRate = 2; // 2% for age 30-35
    } else if (selectedAge <= 40) {
      baseRate = 3; // 3% for age 35-40
    } else if (selectedAge <= 45) {
      baseRate = 4; // 4% for age 40-45
    } else if (selectedAge <= 50) {
      baseRate = 5; // 5% for age 45-50
    } else if (selectedAge <= 60) {
      baseRate = 6; // 6% for age 50-60
    } else if (selectedAge <= 70) {
      baseRate = 7; // 7% for age 60-70
    } else if (selectedAge <= 80) {
      baseRate = 8; // 8% for age 70-80
    } else if (selectedAge <= 90) {
      baseRate = 9; // 9% for age 80-90
    } else if (selectedAge <= 100) {
      baseRate = 10; // 10% for age 90-100
    } else {
      baseRate = 1; // Default rate for age >100
    }
    return baseRate;
  };

  useEffect(() => {
    console.log("Selected Age:", selectedAge);
    console.log("Initial Premium:", initialPremium);
    console.log("Pre-existing Amount:", preExistingAmount);
    console.log("Sum Assured:", sumAssured);
    console.log("Selected Duration:", selectedDuration);
    
    const premiumForSelectedDuration = getPremiumForDuration(
      selectedDuration === "1 Year"
        ? 1
        : selectedDuration === "2 Years"
        ? 2
        : 3
    );
    setFinalPremium(premiumForSelectedDuration);
  }, [selectedDuration, initialPremium, preExistingAmount, sumAssured, preExisting]);

  // Function to calculate the base premium
  const baseRate = calculateBaseRate(selectedAge);
  const calculateInitialPremium = () => {
    return (sumAssured * baseRate) / 100;
  };

  // Update premiums when sumAssured, age, or preExisting changes
   useEffect(() => {
    const initial = calculateInitialPremium(); // Call calculateInitialPremium inside useEffect
    setInitialPremium(initial);

    diseaseData == "Yes" ? setPreExisting(true):setPreExisting(false) ;

    const preExistingCost = preExisting ? (sumAssured * 1) / 100 : 0;
    setPreExistingAmount(preExistingCost);

    setFinalPremium(initial + preExistingCost);
  }, [sumAssured, selectedAge, preExisting]);

  // Function to get the premium based on selected duration
  const getPremiumForDuration = (years) => {
    let premium = initialPremium;

    // Adjust premium based on selected duration
    if (years === 1) {
      return premium + preExistingAmount; // Base amount for 1 year
    } else if (years === 2) {
      const discount = premium * (5 / 100);
      const discountedPremium = premium - discount; // Apply 5% discount to the initial premium
      return discountedPremium * 2 + preExistingAmount; // Double the discounted premium for 2 years
    } else if (years === 3) {
      const discount = premium * (10 / 100);
      const discountedPremium = premium - discount; // Apply 10% discount to the initial premium
      return discountedPremium * 3 + preExistingAmount; // Triple the discounted premium for 3 years
    }
  };

  // Effect to update the final premium when selectedDuration changes
  useEffect(() => {
    const premiumForSelectedDuration = getPremiumForDuration(
      selectedDuration === "1 Year"
        ? 1
        : selectedDuration === "2 Years"
        ? 2
        : 3
    );
    setFinalPremium(premiumForSelectedDuration);
  }, [selectedDuration, initialPremium, preExistingAmount]);
  

  return (
    <div>
      <div>
        <Nav />
        <div className="quotation-page">
          <main className="body">
            <div className="left-section">
              <p><strong>Insurance Type : Individual</strong></p>
              <div className="field-spacing"></div>

              <h2>{username}</h2>
              <div className="field-spacing"></div>

              <h3>Age : {selectedAge}</h3>
              <div className="field-spacing"></div>

              <p><strong>Customer ID:{customerId}</strong> </p>
              <div className="field-spacing"></div>

              <h3>Pre-Existing Diseases : {diseaseData}</h3>
              <div className="field-spacing"></div>

              <h2>Premium Amount : ₹{finalPremium.toLocaleString()}</h2>
              <div className="field-spacing"></div>

              <h2>Pre-Existing Diseases Amount : ₹{preExistingAmount.toLocaleString()}</h2>

              <div className="field-spacing"></div>
            </div>

            <div className="right-section">
              <h3>Sum Assured</h3>
              <p className="amount-display">₹{sumAssured.toLocaleString()}</p>
              <input
                type="range"
                min="500000"
                max="2500000"
                step="500000"
                value={sumAssured}
                onChange={(e) => setSumAssured(Number(e.target.value))}
              />

              <div className="premium-card">
                <h4>Initial Premium Amount Per Year</h4>
                <p>₹{initialPremium.toLocaleString()}</p>
              </div>

              <div className="premium-card">
                <h4>Final Premium Amount Per Year (after disease adjustment)</h4>
                <p>₹{finalPremium.toLocaleString()}</p>
              </div>

              <div className="discount-cards">
                {["1 Year", "2 Years", "3 Years"].map((duration, index) => {
                  const years = index + 1;
                  return (
                    <button
                      key={duration}
                      className={`duration-button ${selectedDuration === duration ? "selected" : ""}`}
                      onClick={() => setSelectedDuration(duration)}
                    >
                      <h5>{duration}</h5>
                      <p>₹{getPremiumForDuration(years).toLocaleString()}</p>
                    </button>
                  );
                })}
              </div>
              <button
                className="proceed-button"
                onClick={handleProceedClick}
                  // alert(
                  //   `Proceeding with ${selectedDuration} premium: ₹${getPremiumForDuration(
                  //     selectedDuration === "1 Year"
                  //       ? 1
                  //       : selectedDuration === "2 Years"
                  //       ? 2
                  //       : 3
                  //   ).toLocaleString()}`
                  // )
              >
                Proceed
              </button>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Quotation;
