import React, { useState, useEffect } from "react";
import Nav from "../../nav/Nav";
import Footer from "../../nav/Footer";
import { useSelector } from "react-redux";
//  import "./Quotationfamily.css";
import axios from 'axios';
import Cookies from 'js-cookie';

const Quotationfamily = () => {
  const [sumAssured, setSumAssured] = useState(500000);
  const [familySize, setFamilySize] = useState(0); // Default to 2 members
  const [preExisting, setPreExisting] = useState(0); // User-provided pre-existing condition length (in years), allows 0
  const [selectedDuration, setSelectedDuration] = useState("1 Year"); // Default selected duration
  const [initialPremium, setInitialPremium] = useState(0); // To store the initial premium amount
  const [finalPremium, setFinalPremium] = useState(0); // To store the final premium amount after considering pre-existing conditions
  const [preExistingAmount, setPreExistingAmount] = useState(0); // To store the premium amount due to pre-existing diseases

  // Function to calculate the base rate
  const calculateBaseRate = () => {
    return 2; // Flat rate for the family size (2% of sum assured per member)
  };

  // Function to calculate initial premium
  const calculateInitialPremium = () => {
    return (sumAssured * familySize) / 100;
  };

 
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

  // Function to handle changes in family size and pre-existing disease input
  const handleInputChange = (e) => {
    // const value = parseInt(e.target.value, 10) || 0; // Parse the input to an integer or default to 0
    // if (value >= 0 && value <= maxLimit) {
    //   setter(value); // Update the state if the value is within the allowed range
    // }
    setPreExisting(e.target.value);
  };

  const relationData = useSelector(
    (state) => state.relations.selectedRelations
  );
  const diseaseData = useSelector(
    (state) => state.relations.disease
  );
  

  const allRelations = [...relationData].filter(
    (relation) => relation
  );
  // allRelations.map((data)=>{console.log(data)})
  // console.log("Hi",relationData,diseaseData)

  const [costumerdetails,setcustomerdetails]=useState([]);

  const customerId = costumerdetails.customerId || 'Not Available';

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

   useEffect(() => {
    const value=allRelations.length;
    setFamilySize(value);
      const initial = calculateInitialPremium();
      setInitialPremium(initial);
  
       diseaseData=="Yes" ? setPreExisting(true):setPreExisting(false)

    // Calculate the amount due to pre-existing diseases
    const preExistingCost = preExisting ?((sumAssured)*( 1/ 100)): 0;
    setPreExistingAmount(preExistingCost);

    // Set the final premium, including pre-existing disease adjustment
    setFinalPremium(initial + preExistingCost);
  }, [sumAssured, familySize, preExisting]);


  return (
    <div>
      <Nav/>
    <div className="quotation-page">
      <main className="body">
        <div className="left-section">

        <p><strong>Insurance Type : Family </strong></p> 

          {/* <h2>John Doe</h2> */}
          <h2>{username}</h2>
          {/* <p>Insurance Type: Family</p> */}

          <h3>Family Size : {allRelations.length}</h3>
         
          <div className="field-spacing"></div> 

          <p><strong>Customer ID:</strong> {customerId}</p>

          <div className="field-spacing"></div> 

          <h3>Pre-Existing Diseases : {diseaseData} </h3>
          
          <div className="field-spacing"></div> 
          
          <h2>Premium Amount : ₹{finalPremium.toLocaleString()}</h2>
          {/* <p>₹{finalPremium.toLocaleString()}</p> */}

          <div className="field-spacing"></div> 

          <h2>Pre-Existing Diseases Amount : ₹{preExistingAmount.toLocaleString()}</h2>
          {/* <p>₹{preExistingAmount.toLocaleString()}</p> Display pre-existing disease premium */}
        </div>

        <div className="right-section">
          {/* <h3>Family Size</h3>
          <input
            type="text"
            value={familySize}
            onChange={(e) => handleInputChange(e, setFamilySize, 15)} // Max 8 members
          />

          <h3>Pre-Existing Diseases</h3>
          <label>
            <input
              type="checkbox"
              checked={preExisting}
              onChange={() => setPreExisting(!preExisting)}
            />
            Yes
          </label> */}

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
            <h4>Initial Premium Amount </h4>
            <p>₹{initialPremium.toLocaleString()}</p>
          </div>

          <div className="premium-card">
            <h4>Final Premium Amount </h4>
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
      <Footer/>
    </div>
  );
};

export default Quotationfamily;
