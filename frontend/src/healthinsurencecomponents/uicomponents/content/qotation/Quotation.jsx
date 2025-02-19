import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  setSumAssured1, 
  setPreExisting1, 
  setPreExistingAmount1, 
  setFinalPremium1, 
  setInitialPremium1, 
  setSelectedDuration1 
} from "../../../../storage/relationsSlice";

// import { setFinalPremium1 } from "../../../../storage/relationsSlice";
import Nav from "../../nav/Nav";
import Footer from "../../nav/Footer";
import "./Quotation.css";

const Quotation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state selectors
  const ageData = useSelector((state) => state.relations.age);
  const diseaseData = useSelector((state) => state.relations.disease);
  const selectedRelations = useSelector((state) => state.relations.selectedRelations);

  // Local states
  const [sumAssured, setSumAssured] = useState(500000);
  const [preExisting, setPreExisting] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("1 Year");
  const [initialPremium, setInitialPremium] = useState(0);
  const [finalPremium, setFinalPremium] = useState(0);
  const [preExistingAmount, setPreExistingAmount] = useState(0);
  const [customerDetails, setCustomerDetails] = useState({});

  const selectedAge = ageData[0] ? ageData[0].Age : 0;
  const mobileNumber = Cookies.get("MobileNumber");

  // Fetch customer details
  useEffect(() => {
    axios.get(`http://183.82.106.55:9100/register/fetch/${mobileNumber}`)
      .then((res) => {
        setCustomerDetails(res.data);
      });
  }, [mobileNumber]);

  const username = customerDetails.fullName
    ? customerDetails.fullName.charAt(0).toUpperCase() + customerDetails.fullName.slice(1)
    : 'Guest';
  const customerId = customerDetails.customerId || 'Not Available';

  

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

  const calculateInitialPremium = () => {
    const baseRate = calculateBaseRate(selectedAge);
    return (sumAssured * baseRate) / 100;
  };

  const getPremiumForDuration = (years) => {
    let premium = initialPremium;
    if (years === 1) {
      return premium + preExistingAmount;
    } else if (years === 2) {
      const discount = premium * 0.05;
      return (premium - discount) * 2 + preExistingAmount;
    } else if (years === 3) {
      const discount = premium * 0.10;
      return (premium - discount) * 3 + preExistingAmount;
    }
  };



  useEffect(() => {
    const initial = calculateInitialPremium();
    setInitialPremium(initial);
    setPreExisting(diseaseData === "Yes");
  
    const preExistingCost = preExisting ? (sumAssured * 1) / 100 : 0;
    setPreExistingAmount(preExistingCost);
    setFinalPremium(initial + preExistingCost);
  
    // Dispatch updates to Redux store
    dispatch(setSumAssured1(sumAssured));
    dispatch(setPreExisting1(preExisting));
    dispatch(setPreExistingAmount1(preExistingCost));
    dispatch(setInitialPremium1(initial));
    dispatch(setFinalPremium1(initial + preExistingCost));
    dispatch(setSelectedDuration1(selectedDuration));
  
    console.log("Redux Store Updated:", {
      sumAssured,
      preExisting,
      preExistingAmount: preExistingCost,
      initialPremium: initial,
      finalPremium: initial + preExistingCost,
      selectedDuration
    });
  
  }, [sumAssured, selectedAge, preExisting, selectedDuration, diseaseData, dispatch]);
  
  const handleProceedClick = () => {
    alert(`Proceeding with ${selectedDuration} premium: ₹${finalPremium.toLocaleString()}`);
  
    // Dispatch updated values to Redux
    dispatch(setSumAssured1(sumAssured));
    dispatch(setPreExisting1(preExisting));
    dispatch(setPreExistingAmount1(preExistingAmount));
    dispatch(setInitialPremium1(initialPremium));
    dispatch(setFinalPremium1(finalPremium)); // Use the latest finalPremium value
    dispatch(setSelectedDuration1(selectedDuration));
  
    console.log("Redux Store Updated:", {
      sumAssured,
      preExisting,
      preExistingAmount: preExistingAmount,
      initialPremium: initialPremium,
      finalPremium: finalPremium,
      selectedDuration
    });

    sessionStorage.setItem("sumAssuredAmount", JSON.stringify(sumAssured));
    sessionStorage.setItem("YearOption", JSON.stringify(selectedDuration));
    sessionStorage.setItem("initialPremiumAMountOption", JSON.stringify(initialPremium));
    sessionStorage.setItem("FinalPremiumAmountOption", JSON.stringify(finalPremium));
  
    navigate('/review');
  };

   useEffect(() => {
      const data = sessionStorage.getItem("sumAssuredAmount");
      const dataOfYearOption = sessionStorage.getItem("YearOption");
      const datainitialPremium = sessionStorage.getItem("initialPremiumAMountOption");
      const datafinalPremium = sessionStorage.getItem("FinalPremiumAmountOption");
  
      const ipdata = data ? JSON.parse(data) : [];
      const ipdataselectedDuration = dataOfYearOption ? JSON.parse(dataOfYearOption) : [];
      const ipdatainitialPremium = datainitialPremium ? JSON.parse(datainitialPremium) : [];
      const ipdatafinalPremium = datafinalPremium ? JSON.parse(datafinalPremium) : [];
  
      console.log(ipdata, ipdatafinalPremium, ipdatainitialPremium, ipdataselectedDuration);
  
      if (ipdata.length === 0) {
        console.log("No data found for sumAssuredAmount");
      } else {
        setSumAssured(ipdata);
      }
  
      if (ipdataselectedDuration.length > 0) {
        setSelectedDuration(ipdataselectedDuration);
      }
  
      if (ipdatainitialPremium.length > 0) {
        setInitialPremium(ipdatainitialPremium);
      }
  
      if (ipdatafinalPremium.length > 0) {
        setFinalPremium(ipdatafinalPremium);
      }
    }, []);
  
  
useEffect(() => {
  // Recalculate initial premium based on sumAssured and age
  const initial = calculateInitialPremium(); // (sumAssured * baseRate) / 100

  // Directly derive the preExisting flag from diseaseData
  const preExistingFlag = diseaseData === "Yes";
  // Calculate pre-existing cost immediately
  const preExistingCost = preExistingFlag ? (sumAssured * 1) / 100 : 0;

  // Determine the number of years based on selectedDuration
  const years = selectedDuration === "1 Year" ? 1 
               : selectedDuration === "2 Years" ? 2 
               : 3;

  // Calculate final premium using the freshly calculated values
  let premiumForSelectedDuration;
  if (years === 1) {
    premiumForSelectedDuration = initial + preExistingCost;
  } else if (years === 2) {
    const discount = initial * 0.05;
    premiumForSelectedDuration = (initial - discount) * 2 + preExistingCost;
  } else if (years === 3) {
    const discount = initial * 0.10;
    premiumForSelectedDuration = (initial - discount) * 3 + preExistingCost;
  }

  // Update local state with the newly calculated values
  setInitialPremium(initial);
  setPreExistingAmount(preExistingCost);
  setFinalPremium(premiumForSelectedDuration);

  // Dispatch updated values to Redux store
  dispatch(setSumAssured1(sumAssured));
  dispatch(setPreExisting1(preExistingFlag));
  dispatch(setPreExistingAmount1(preExistingCost));
  dispatch(setInitialPremium1(initial));
  dispatch(setFinalPremium1(premiumForSelectedDuration));
  dispatch(setSelectedDuration1(selectedDuration));

  console.log("Redux Store Updated:", {
    sumAssured,
    preExisting: preExistingFlag,
    preExistingAmount: preExistingCost,
    initialPremium: initial,
    finalPremium: premiumForSelectedDuration,
    selectedDuration,
  });
}, [
  sumAssured,       // Recalculate when sumAssured changes
  selectedAge,      // Recalculate when age changes
  diseaseData,      // Recalculate when disease data changes
  selectedDuration, // Recalculate when duration changes
  dispatch,
]);

  return (
    <div>
      <Nav />
      <div className="quotation-page">
        <main className="body">
          <div className="left-section">
            <p><strong>Insurance Type: Individual</strong></p>
            <div className="field-spacing"></div>

            <h2>{username}</h2>
            <div className="field-spacing"></div>

            <h3>Age: {selectedAge}</h3>
            <div className="field-spacing"></div>

            <p><strong>Customer ID: {customerId}</strong></p>
            <div className="field-spacing"></div>

            <h3>Pre-Existing Diseases: {diseaseData}</h3>
            <div className="field-spacing"></div>

            <h2>Premium Amount: ₹{finalPremium.toLocaleString()}</h2>
            <div className="field-spacing"></div>

            <h2>Pre-Existing Diseases Amount: ₹{preExistingAmount.toLocaleString()}</h2>
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

            <button className="proceed-button" onClick={handleProceedClick}>
              Proceed
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Quotation;
