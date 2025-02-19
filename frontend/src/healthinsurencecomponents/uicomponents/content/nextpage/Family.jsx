import React, { useEffect, useState } from "react";
import { Stack, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Nav from "../../nav/Nav";
import Cookies from 'js-cookie';
import './Family.css';
import { useDispatch } from "react-redux";
import { setSelectedRelations } from "../../../../storage/relationsSlice";
import Footer from "../../nav/Footer";

function Family() {

  const dispatch = useDispatch();

  const usergender = Cookies.get('UserDetails');


  const insurenceType = sessionStorage.getItem('typeOfInsurance');

  console.log(insurenceType);
  const [MultipleRelation, setMultipleRelation] = useState([]);
  const [relationName, setRelationname] = useState("");

  const [selectedButton, setSelectedButton] = useState(null);
  const [showMoreMembers, setShowMoreMembers] = useState(false);

  // Store Son and Daughter details in arrays
  const [sonDetails, setSonDetails] = useState([]);
  const [daughterDetails, setDaughterDetails] = useState([]);

  const navigate = useNavigate(); // Initialize navigate


  const handleButtonClick = (button, relation) => {
    setSelectedButton(button);
    setRelationname(relation);
  };

  const [userName, setUserName] = useState(Cookies.get('UserName') || ""); // Fetch username from cookies

  const handleToggleRelation = (relation) => {
    if (insurenceType === "Individual") {
      // For Individual type, allow selecting Daughter and Son as well
      setMultipleRelation([relation]);
    } else {
      // For other types, allow multiple relations
      setMultipleRelation((prev) =>
        prev.includes(relation)
          ? prev.filter((item) => item !== relation)
          : [...prev, relation]
      );
    }
  };

  const toggleShowMoreMembers = () => {
    setShowMoreMembers(true); // Always show more members
  };

  // const isContinueButtonEnabled = MultipleRelation.length > 0;

  const handleContinue = () => {
    if (isContinueButtonEnabled) {
      const combinedData = [
        ...MultipleRelation,
        ...sonDetails,
        ...daughterDetails,
      ];
      dispatch(setSelectedRelations(combinedData));
      sessionStorage.setItem("selectedRelation", JSON.stringify(combinedData));

      navigate("/page"); // Navigate to the desired route
    }
  };
  console.log(MultipleRelation);
  const [insuranceType, setInsuranceType] = useState("individual");

  useEffect(() => {
    const storedInsuranceType = sessionStorage.getItem("typeOfInsurance");
    const currentInsuranceType = storedInsuranceType || "Individual";
    console.log(currentInsuranceType)
    if (currentInsuranceType === "Individual") {
      console.log("Processing individual insurance type");
      // Handle individual-specific logic here
      const data = sessionStorage.getItem("selectedRelation");
      const ipdata = data ? JSON.parse(data) : [];
      console.log(ipdata);

      let selectedRelation = ipdata.length > 0 ? [ipdata[0]] : []; // Allow only the first relation
      console.log("Selected relation for individual:", selectedRelation);

      const relation = selectedRelation[0]; // Only one relation is allowed
      if (relation === "Daughter") {
        setDaughterDetails([relation]);
        setSonDetails([]);
        setMultipleRelation([]);
      } else if (relation === "Son") {
        setSonDetails([relation]);
        setDaughterDetails([]);
        setMultipleRelation([]);
      } else {
        setMultipleRelation([relation]);
        setDaughterDetails([]);
        setSonDetails([]);
      }

    } else if (currentInsuranceType === "Family") {
      console.log("Processing family insurance type");

      const data = sessionStorage.getItem("selectedRelation");
      const ipdata = data ? JSON.parse(data) : [];
      console.log(ipdata);

      const newDaughterDetails = [];
      const newSonDetails = [];
      const newMultipleRelation = [];

      ipdata.forEach((element) => {
        console.log(element); // Debug log
        if (element === "Daughter") {
          newDaughterDetails.push(element);
        } else if (element === "Son") {
          newSonDetails.push(element);
        } else {
          newMultipleRelation.push(element);
        }
      });

      // Update states
      setDaughterDetails(newDaughterDetails);
      setSonDetails(newSonDetails);
      setMultipleRelation(newMultipleRelation);
    }
  }, [insuranceType]);

  console.log(MultipleRelation);
  const isContinueButtonEnabled = insurenceType === "Individual"
    ? (
      MultipleRelation.length > 0 || daughterDetails.length > 0 || sonDetails.length > 0  // Ensure that at least one relation or daughter/son detail is selected

    )
    : (
      (MultipleRelation.length + daughterDetails.length + sonDetails.length) >= 2
    );





  const imageSelfIcon =
    usergender === "male"
      // usergender === "Male"
      ? "https://cdn-icons-png.flaticon.com/512/3070/3070663.png"
      : "https://thumb.ac-illust.com/be/bee98c70d1cfc02d0f387d2852464bf5_t.jpeg";

  const imageHusbandIcon =
    usergender === "male"
      // usergender === "Male"
      ? "https://thumb.ac-illust.com/be/bee98c70d1cfc02d0f387d2852464bf5_t.jpeg"
      : "https://cdn-icons-png.flaticon.com/512/3070/3070663.png";

  const relationValue = usergender === "male" ? "Wife" : "Husband";



  // Handle increment and decrement for Daughter and Son with a limit of 4
  const handleIncrement = (relation) => {
    if (relation === "Daughter" && daughterDetails.length < 4) {
      setDaughterDetails((prevDetails) => [...prevDetails, "Daughter"]);
    }
    if (relation === "Son" && sonDetails.length < 4) {
      setSonDetails((prevDetails) => [...prevDetails, "Son"]);
    }
  };

  const handleDecrement = (relation) => {
    if (relation === "Daughter" && daughterDetails.length > 0) {
      setDaughterDetails((prevDetails) => prevDetails.slice(0, -1));
    }
    if (relation === "Son" && sonDetails.length > 0) {
      setSonDetails((prevDetails) => prevDetails.slice(0, -1));
    }
  };

  console.log("Daughter Details:", daughterDetails);
  console.log("Son Details:", sonDetails);

  console.log(MultipleRelation);

  Cookies.set('RelatioData', MultipleRelation);

  return (
    <div>
      <div>

        <Nav />
      </div>
      <div>
        <div className="text-center mt-3">
          <h1 style={{ fontSize: "30px" }}>Covered Relations</h1>
        </div>
        {/* <div className="text-center fs-5">
          <h5>Gender: {usergender }</h5>
        </div> */}

        {/* <div className="text-center fs-5">
       <h5>Gender: {usergender ? usergender.charAt(0).toUpperCase() + usergender.slice(1) : ""}</h5>
       </div> */}

        <div className=" type text-center fs-5">
          {/* <p>Insurance Type: {insurenceType}</p> */}
          <p><strong>Insurance Type:</strong> {insurenceType}</p>
        </div>

        <div style={{ marginTop: "50px", textAlign: "center" }}>
          <Stack spacing={2} direction="row" justifyContent="center">
            <Button
              variant={MultipleRelation.includes("Self") ? "contained" : "outlined"}
              style={{
                width: "150px",
                height: "80px",
                border: "2px solid black",
              }}
              onClick={() => handleToggleRelation("Self")}
              startIcon={
                <img
                  src={imageSelfIcon}
                  alt="Self"
                  style={{ width: "28px", height: "28px" }}
                />
              }
            >
              {/* {MultipleRelation.includes("Self") && insurenceType === "Individual"
    ? userName // Display username if Self is selected and insurance type is Individual
    : "Self"} */}

              Self
            </Button>
            <Button
              variant={MultipleRelation.includes(relationValue) ? "contained" : "outlined"}
              style={{
                width: "150px",
                height: "80px",
                border: "2px solid black",
              }}
              onClick={() => handleToggleRelation(relationValue)}
              startIcon={
                <img
                  src={imageHusbandIcon}
                  alt="Husband"
                  style={{ width: "28px", height: "28px" }}
                />
              }
            >
              {relationValue}
            </Button>
            <Button
              variant={MultipleRelation.includes("Mother") ? "contained" : "outlined"}
              style={{
                width: "150px",
                height: "80px",
                border: "2px solid black",
              }}
              onClick={() => handleToggleRelation("Mother")}
              startIcon={
                <img
                  src="https://png.pngtree.com/png-vector/20220210/ourlarge/pngtree-avatar-female-character-mother-png-image_4384454.png"
                  alt="Mother"
                  style={{ width: "28px", height: "28px" }}
                />
              }
            >
              Mother
            </Button>
            <Button
              variant={MultipleRelation.includes("Father") ? "contained" : "outlined"}
              style={{
                width: "150px",
                height: "80px",
                border: "2px solid black",
              }}
              onClick={() => handleToggleRelation("Father")}
              startIcon={
                <img
                  src="https://www.icon0.com/free/static2/preview2/stock-photo-indian-man-avatar-people-icon-character-cartoon-32890.jpg"
                  alt="Father"
                  style={{ width: "28px", height: "28px" }}
                />
              }
            >
              Father
            </Button>
          </Stack>
          <div style={{ marginTop: "35px", padding: "32px" }}>
            <Stack spacing={2} direction="row" justifyContent="center">
              {/* Daughter Button with Increment/Decrement */}
              <div>
                {insurenceType === "Family" ? (
                  <div>
                    <div
                      style={{
                        width: "150px",
                        height: "100px",
                        border: "2px solid black",
                        textAlign: "center",
                        borderRadius: "8px",
                        padding: "10px",
                        color: "black",
                        // backgroundColor: daughterDetails.length > 0 ? "contained" : "blue",
                        // border: daughterDetails.length > 0 ? "2px solid black" : "2px solid black",

                      }}
                    >
                      <img
                        src="https://img.freepik.com/premium-vector/daughter-icon-vector-image-can-be-used-family-life_120816-219665.jpg?w=360"
                        alt="Daughter"
                        style={{ width: "28px", height: "28px" }}
                      />
                      <p className="text-primary">DAUGHTER</p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() => handleDecrement("Daughter")}
                          disabled={daughterDetails.length <= 0}
                          style={{
                            padding: "0 10px",
                            fontSize: "16px",
                            cursor: daughterDetails.length > 0 ? "pointer" : "not-allowed",
                          }}
                        >
                          -
                        </button>
                        <span style={{ margin: "0 10px" }}>{daughterDetails.length}</span>
                        <button
                          onClick={() => handleIncrement("Daughter")}
                          disabled={daughterDetails.length >= 4}
                          style={{
                            padding: "0 10px",
                            fontSize: "16px",
                            cursor: daughterDetails.length < 4 ? "pointer" : "not-allowed",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Button
                      // variant={daughterDetails.length>0 ? "contained" : "outlined"}
                      variant={MultipleRelation.includes("Daughter") ? "contained" : "outlined"}
                      style={{
                        width: "150px",
                        height: "80px",
                        border: "2px solid black",
                      }}
                      onClick={() => handleToggleRelation("Daughter")}
                      startIcon={
                        <img
                          src="https://img.freepik.com/premium-vector/daughter-icon-vector-image-can-be-used-family-life_120816-219665.jpg?w=360"
                          alt="Daughter"
                          style={{ width: "28px", height: "28px" }}
                        />
                      }
                    >
                      Daughter
                    </Button>
                  </div>
                )}
              </div>

              {/* Son Button with Increment/Decrement */}
              <div>
                {insurenceType === "Family" ? (
                  <div>
                    <div
                      style={{
                        width: "150px",
                        height: "100px",
                        border: "2px solid black",
                        // border: sonDetails.length > 0 ? "3px solid blue" : "2px solid black",
                        textAlign: "center",
                        borderRadius: "8px",
                        padding: "10px",
                        // backgroundColor: sonDetails.length > 0 ? "#f0f8ff" : "white",

                      }}
                    >
                      <img
                        src="https://cdn-icons-png.freepik.com/512/7084/7084418.png"
                        alt="Son"
                        style={{ width: "28px", height: "28px" }}
                      />
                      <p className="text-primary">SON</p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() => handleDecrement("Son")}
                          disabled={sonDetails.length <= 0}
                          style={{
                            padding: "0 10px",
                            fontSize: "16px",
                            cursor: sonDetails.length > 0 ? "pointer" : "not-allowed",
                          }}
                        >
                          -
                        </button>
                        <span style={{ margin: "0 10px" }}>{sonDetails.length}</span>
                        <button
                          onClick={() => handleIncrement("Son")}
                          disabled={sonDetails.length >= 4}
                          style={{
                            padding: "0 10px",
                            fontSize: "16px",
                            cursor: sonDetails.length < 4 ? "pointer" : "not-allowed",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Button
                      // variant={sonDetails.length > 0 ? "contained" : "outlined"}
                      variant={MultipleRelation.includes("Son") ? "contained" : "outlined"}
                      style={{
                        width: "155px",
                        height: "80px",
                        border: "2px solid black",
                      }}
                      onClick={() => handleToggleRelation("Son")}
                      startIcon={
                        <img
                          src="https://cdn-icons-png.freepik.com/512/7084/7084418.png"
                          alt="Son"
                          style={{ width: "28px", height: "28px" }}
                        />
                      }
                    >
                      Son
                    </Button>
                  </div>
                )}
              </div>
            </Stack>
          </div>

          {showMoreMembers && (
            <div style={{ marginTop: "35px", padding: "32px" }}>
              <Stack spacing={2} direction="row" justifyContent="center">
                <Button
                  variant={MultipleRelation.includes("Grandmother") ? "contained" : "outlined"}
                  style={{
                    width: "170px",
                    height: "80px",
                    border: "2px solid black",
                  }}
                  onClick={() => handleToggleRelation("Grandmother")}
                  startIcon={
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4395/4395811.png"
                      alt="Grandmother"
                      style={{ width: "28px", height: "28px" }}
                    />
                  }
                >
                  Grandmother
                </Button>
                <Button
                  variant={MultipleRelation.includes("Grandfather") ? "contained" : "outlined"}
                  style={{
                    width: "165px",
                    height: "80px",
                    border: "2px solid black",
                  }}
                  onClick={() => handleToggleRelation("Grandfather")}
                  startIcon={
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/2829/2829817.png"
                      alt="Grandfather"
                      style={{ width: "28px", height: "28px" }}
                    />
                  }
                >
                  Grandfather
                </Button>


                <Button
                  variant={MultipleRelation.includes("Father-in-Law") ? "contained" : "outlined"}
                  style={{
                    width: "180px",
                    height: "80px",
                    border: "2px solid black",
                  }}
                  onClick={() => handleToggleRelation("Father-in-Law")}
                  startIcon={
                    <img
                      src="https://cdn-icons-png.flaticon.com/256/1663/1663005.png"
                      alt="Father-in-Law"
                      style={{ width: "28px", height: "28px" }}
                    />
                  }
                >
                  Father-in-Law
                </Button>
                <Button
                  variant={MultipleRelation.includes("Mother-in-Law") ? "contained" : "outlined"}
                  style={{
                    width: "180px",
                    height: "80px",
                    border: "2px solid black",

                  }}
                  onClick={() => handleToggleRelation("Mother-in-Law")}
                  startIcon={
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/6872/6872417.png"
                      alt="Mother-in-Law"
                      style={{ width: "28px", height: "28px" }}
                    />
                  }
                >
                  Mother-in-Law
                </Button>
              </Stack>
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            {!showMoreMembers && (
              <a href="#" onClick={toggleShowMoreMembers}>
                Show More Members
              </a>
            )}
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Button
              variant="contained"
              color="warning"
              disabled={!isContinueButtonEnabled}
              style={{ width: "200px", height: "50px" }}
              onClick={handleContinue} // Added onClick to trigger navigation

            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* <footer
        className="bg-light text-center py-1  mt-5"
        style={{
          // bottom: 700,
          width: "100%",
        }}
      >
        <div className="d-flex justify-content-center mb-2">
          <IconButton href="https://facebook.com" target="_blank" color="primary">
            <FacebookIcon />
          </IconButton>
         
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
      </footer> */}
      <Footer />
    </div>
  );
}
export default Family;
