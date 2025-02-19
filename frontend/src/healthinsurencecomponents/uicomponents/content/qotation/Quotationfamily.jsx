import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"; // ✅ Import useDispatch
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Nav from "../../nav/Nav";
import Footer from "../../nav/Footer";

import {
  setSumAssured1,
  setPreExisting1,
  setPreExistingAmount1,
  setFinalPremium1,
  setInitialPremium1,
  setSelectedDuration1
} from "../../../../storage/relationsSlice";

const Quotationfamily = () => {
  const dispatch = useDispatch(); // ✅ Initialize useDispatch
  const navigate = useNavigate();

  const [sumAssured, setSumAssured] = useState(500000);
  const [familySize, setFamilySize] = useState(2);
  const [preExisting, setPreExisting] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState("1 Year");
  const [initialPremium, setInitialPremium] = useState(0);
  const [finalPremium, setFinalPremium] = useState(0);
  const [preExistingAmount, setPreExistingAmount] = useState(0);
  const [sumAssuredData, setSumAssuredData] = useState([]);

  const relationData = useSelector(state => state.relations.selectedRelations);
  const diseaseData = useSelector(state => state.relations.disease);

  const allRelations = [...relationData].filter(relation => relation);

  const [customerDetails, setCustomerDetails] = useState({});
  const customerId = customerDetails.customerId || "Not Available";
  const username = customerDetails.fullName
    ? customerDetails.fullName.charAt(0).toUpperCase() + customerDetails.fullName.slice(1)
    : "";

  const mobileNumber = Cookies.get("MobileNumber");

  useEffect(() => {
    axios.get(`http://183.82.106.55:9100/register/fetch/${mobileNumber}`)
      .then(res => {
        setCustomerDetails(res.data);
      })
      .catch(err => console.error("Error fetching customer details:", err));
  }, [mobileNumber]);

  // Function to calculate initial premium
  const calculateInitialPremium = () => {
    return (sumAssured * familySize) / 100;
  };

  // Update Premium Values
  useEffect(() => {
    const initial = calculateInitialPremium();
    setInitialPremium(initial);

    const preExistingCost = preExisting ? (sumAssured * 1) / 100 : 0;
    setPreExistingAmount(preExistingCost);

    setFinalPremium(initial + preExistingCost);
  }, [sumAssured, familySize, preExisting]);

  // Function to get premium based on selected duration
  const getPremiumForDuration = (years) => {
    let premium = initialPremium;
    if (years === 1) {
      return premium + preExistingAmount;
    } else if (years === 2) {
      const discount = premium * 0.05;
      return (premium - discount) * 2 + preExistingAmount;
    } else if (years === 3) {
      const discount = premium * 0.1;
      return (premium - discount) * 3 + preExistingAmount;
    }

    // Dispatch updated values to Redux store
    dispatch(setSumAssured1(sumAssured));
    dispatch(setPreExisting1(preExisting));
    dispatch(setPreExistingAmount1(preExistingAmount));
    dispatch(setInitialPremium1(initialPremium));
    dispatch(setFinalPremium1(selectedDuration));
    dispatch(setSelectedDuration1(selectedDuration));

  };

  // Update Redux Store when premium values change
  useEffect(() => {

    dispatch(setSumAssured1(sumAssured));
    dispatch(setPreExisting1(preExisting));
    dispatch(setPreExistingAmount1(preExistingAmount));
    dispatch(setInitialPremium1(initialPremium));
    dispatch(setFinalPremium1(finalPremium));
    dispatch(setSelectedDuration1(selectedDuration));

    // console.log("Redux Store Updated:", {
    //   sumAssured,
    //   preExisting,
    //   preExistingAmount,
    //   initialPremium,
    //   finalPremium,
    //   selectedDuration
    // });
  }, [sumAssured, preExisting, preExistingAmount, initialPremium, finalPremium, selectedDuration, dispatch]);

  const handleProceedClick = () => {
    // alert(
    //   `Proceeding with ${selectedDuration} premium: ₹${getPremiumForDuration(
    //     selectedDuration === "1 Year" ? 1 : selectedDuration === "2 Years" ? 2 : 3
    //   ).toLocaleString()}`
    // );

    // alert(`Proceeding with ${selectedDuration} premium: ₹${finalPremium.toLocaleString()}`);

    // Dispatch updated values to Redux
    dispatch(setSumAssured1(sumAssured));
    dispatch(setPreExisting1(preExisting));
    dispatch(setPreExistingAmount1(preExistingAmount));
    dispatch(setInitialPremium1(initialPremium));
    dispatch(setFinalPremium1(finalPremium)); // Use the latest finalPremium value
    dispatch(setSelectedDuration1(selectedDuration));

    // console.log("Redux Store Updated:", {
    //   sumAssured,
    //   preExisting,
    //   preExistingAmount: preExistingAmount,
    //   initialPremium: initialPremium,
    //   finalPremium: finalPremium,
    //   selectedDuration
    // });
    sessionStorage.setItem("sumAssuredAmount", JSON.stringify(sumAssured));
    sessionStorage.setItem("YearOption", JSON.stringify(selectedDuration));
    sessionStorage.setItem("initialPremiumAMountOption", JSON.stringify(initialPremium));
    sessionStorage.setItem("FinalPremiumAmountOption", JSON.stringify(finalPremium));
    navigate("/review");
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
      <Nav />
      <div className="quotation-page">
        <main className="body">
          <div className="left-section">
            <p><strong>Insurance Type: Family</strong></p>
            <div className="field-spacing"></div>
            <h2>{username}</h2>
            <div className="field-spacing"></div>
            <h3>Family Size: {allRelations.length}</h3>
            <div className="field-spacing"></div>
            <p><strong>Customer ID:</strong> {customerId}</p>
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
              <h4>Initial Premium Amount</h4>
              <p>₹{initialPremium.toLocaleString()}</p>
            </div>

            <div className="premium-card">
              <h4>Final Premium Amount</h4>
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

export default Quotationfamily;
