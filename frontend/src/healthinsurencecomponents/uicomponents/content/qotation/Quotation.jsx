import React, { useState, useEffect } from "react";
import Nav from "../../nav/Nav";
import Footer from "../../nav/Footer";
import "./Quotation.css";
// import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios';
import Cookies from 'js-cookie';


const Quotation = () => {
  const [sumAssured, setSumAssured] = useState(500000);
  const [age, setAge] = useState("0-30"); // Default selected range
  const [preExisting, setPreExisting] = useState(false); // User-provided pre-existing condition
  const [selectedDuration, setSelectedDuration] = useState("1 Year"); // Default selected duration
  const [initialPremium, setInitialPremium] = useState(0); // To store the initial premium amount
  const [finalPremium, setFinalPremium] = useState(0); // To store the final premium amount after considering pre-existing conditions
  const [preExistingAmount, setPreExistingAmount] = useState(0); // To store the premium amount due to pre-existing diseases

  const ageRanges = [
    "0-30",
    "30-35",
    "35-40",
    "40-45",
    "45-50",
    "50-60",
    "60-70",
    "70-80",
    "80-90",
    "90-100",
  ];

  // const navigate = useNavigate();

  // Function to calculate the base rate based on the age range
  const calculateBaseRate = (selectedAge) => {
    const [minAge, maxAge] = selectedAge.split("-").map(Number);

    //  const dispatch = useDispatch();

    //  dispatch(setAge(selectedAge));
    //  dispatch(setDisease(hasDisease ? 'Yes' : 'No'));

     

    let baseRate = 0;
    if (maxAge <= 30) {
      baseRate = 1; // 1% for age 0-30
    } else if (maxAge <= 35) {
      baseRate = 2; // 2% for age 30-35
    } else if (maxAge <= 40) {
      baseRate = 3; // 3% for age 35-40
    } else if (maxAge <= 45) {
      baseRate = 4; // 4% for age 40-45
    } else if (maxAge <= 50) {
      baseRate = 5; // 5% for age 45-50
    } else if (maxAge <= 60) {
      baseRate = 6; // 6% for age 50-60
    } else if (maxAge <= 70) {
      baseRate = 7; // 7% for age 60-70
    } else if (maxAge <= 80) {
      baseRate = 8; // 8% for age 70-80
    } else if (maxAge <= 90) {
      baseRate = 9; // 9% for age 80-90
    } else {
      baseRate = 10; // 10% for age 90-100
    }

    return baseRate;
  };

  // Function to calculate initial premium
  const calculateInitialPremium = () => {
    const baseRate = calculateBaseRate(age);
    return (sumAssured * baseRate) / 100;
  };

  // Effect to update the initial and final premiums when sumAssured, age, or preExisting changes
  useEffect(() => {
    const initial = calculateInitialPremium();
    setInitialPremium(initial);

    // Calculate the amount due to pre-existing diseases
    const preExistingCost = preExisting ? (sumAssured * 1) / 100 : 0;
    setPreExistingAmount(preExistingCost);

    // Set the final premium, including pre-existing disease adjustment
    setFinalPremium(initial + preExistingCost);
  }, [sumAssured, age, preExisting]);

  // Function to get the premium based on selected duration
  const getPremiumForDuration = (years) => {
    let premium = initialPremium;

    // Adjust premium based on selected duration
    if (years === 1) {
      return premium + preExistingAmount;  // Base amount for 1 year
    } else if (years === 2) {
      const discount = premium * (5 / 100);
      const discountedPremium = premium - discount;  // Apply 5% discount to the initial premium
      return (discountedPremium * 2) + preExistingAmount;  // Double the discounted premium for 2 years
    } else if (years === 3) {
      const discount = premium * (10 / 100)
      const discountedPremium = premium - discount;  // Apply 10% discount to the initial premium
      return (discountedPremium * 3) + preExistingAmount;  // Triple the discounted premium for 3 years
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

    // navigate("/review"); 

    setFinalPremium(premiumForSelectedDuration);
  }, [selectedDuration, initialPremium, preExistingAmount]);

  const relationData = useSelector(
    (state) => state.relations.selectedRelations
  );
  const diseaseData = useSelector(
    (state) => state.relations.disease
  );

  const ageData = useSelector(
    (state) => state.relations.age
  );
  const ageDataFind = ageData.map((data) => data.Age);


  const allRelations = [...relationData].filter(
    (relation) => relation
  );
  // allRelations.map((data)=>{console.log(data)})
  // console.log(diseaseData, ageDataFind)
   const [costumerdetails,setcustomerdetails]=useState([]);

  const value = Cookies.get("MobileNumber");
  useEffect(()=>{
    axios.get('http://183.82.106.55:9100/register/fetch/'+value).then((res)=>{
      // console.log(res.data);
      setcustomerdetails(res.data);
    },[value])
  });
  
  const username = costumerdetails.fullName
  ? costumerdetails.fullName.charAt(0).toUpperCase() + costumerdetails.fullName.slice(1)
  : '';

  const customerId = costumerdetails.customerId || 'Not Available';

  useEffect(() => {
    const mobNo = Cookies.get("MobileNumber");
    axios
      .get(`http://183.82.106.55:9100/register/fetch/${mobNo}`)
      .then((res) => {
        setCustomerDetails(res.data);
        setData((prevData) =>
          prevData.map((item) => ({ ...item, CustomerId: res.data.customerId }))
        );
      })
      .catch((error) => {
        console.error("Error fetching customer details:", error);
      });
  }, []);
  
  // console.log("Pre-existing condition:", preExisting);
  // console.log("Calculated Pre-Existing Diseases Amount:", preExistingAmount);


  return (
    <div>
      <div>
        <Nav />
        <div className="quotation-page">
          <main className="body">
            <div className="left-section">

              <p><strong>Insurance Type : Individual</strong></p>

              {/* <h2>John Doe</h2> */}
              <h2>{username}</h2>

              <h3>Age : {ageDataFind} </h3>

              <div className="field-spacing"></div> 

              {/* <p><strong>Customer ID:</strong> {StoreData[index].CustomerId}</p> */}
              {/* <p><strong>Customer ID:</strong> {costumerdetails.CustomerId || "Not Available"}</p> */}
              <p><strong>Customer ID:</strong> {customerId}</p>

              <div className="field-spacing"></div> 

               <h3>Pre-Existing Diseases : {diseaseData}</h3>

               <div className="field-spacing"></div> 

              <h2>Premium Amount : ₹{finalPremium.toLocaleString()}</h2>
              {/* <p>₹{finalPremium.toLocaleString()}</p> */}

              <div className="field-spacing"></div>

              <h2>Pre-Existing Diseases Amount : ₹{preExistingAmount.toLocaleString()}</h2>
              {/* <p>₹{preExistingAmount.toLocaleString()}</p> */}
              
              {/* <h2>Pre-Existing Diseases Amount: ₹{preExistingAmount ? preExistingAmount.toLocaleString() : "0"}</h2> */}
              
              {/* {preExisting && (
  <h2>Pre-Existing Diseases Amount : ₹{preExistingAmount.toLocaleString()}</h2>
)} */}

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
                      className={`duration-button ${selectedDuration === duration ? "selected" : ""
                        }`}
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
                onClick={() =>
                  alert(
                    `Proceeding with ${selectedDuration} premium: ₹${getPremiumForDuration(
                      selectedDuration === "1 Year"
                        ? 1
                        : selectedDuration === "2 Years"
                          ? 2
                          : 3
                    ).toLocaleString()}`
                  )
                }
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












































