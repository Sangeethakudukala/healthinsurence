
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Relation.css";
import Nav from "../../nav/Nav";
import Footer from "../../nav/Footer";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { setDisease,setAge } from "../../../../storage/relationsSlice";

 function Relation() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
  const [customerDetails, setCustomerDetails] = useState({});

  // const relationData = [
  //   "Mother",
  //   "Father",
  //   "GrandMother",
  //   "GrandFather",
  //   "Mother-In-Law",
  //   "Father-In-Law",
  // ];
  const relationData = useSelector(
    (state) => state.relations.selectedRelations
  );


  const sonData = [];
  const daughterData = [];

  const allRelations = [...relationData, ...sonData, ...daughterData].filter(
    (relation) => relation
  );

  const genderMapping = {
     Self: Cookies.get("UserDetails")
          ? Cookies.get("UserDetails").charAt(0).toUpperCase() + Cookies.get("UserDetails").slice(1)
          : "Unknown",
    Husband :"Male",
    Wife:"Female",
    Mother: "Female",
    Father: "Male",
    GrandMother: "Female",
    GrandFather: "Male",
    "Mother-In-Law": "Female",
    "Father-In-Law": "Male",
    Son: "Male",
    Daughter: "Female",
  };


  const resolvedGender = (relation) => {
    if (genderMapping[relation]) return genderMapping[relation];
    if (relation.toLowerCase().includes("grand")) {
      return relation.toLowerCase().includes("mother") ? "Female" : "Male";
    }
    if (relation.toLowerCase().includes("in-law")) {
      return relation.toLowerCase().includes("mother") ? "Female" : "Male";
    }
    return "Not Available"; 
  };


   const [StoreData, setData] = useState(
      allRelations
        .filter((relation) => genderMapping[relation] || resolvedGender(relation))
        .map((relation) => ({
          Relation: relation,
          Age: "",
          RelationPersonName: "",
          Gender: genderMapping[relation] || resolvedGender(relation),
          CustomerId: "",
          Disease: "",
          DiseaseDetails: "",
          errorMessage: { Age: "", RelationPersonName: "" },
        }))
    );

  // const [StoreData, setData] = useState(
  //   allRelations.map((relation) => ({
  //     Relation: relation,
  //     Age: "",
  //     RelationPersonName: "",
  //     Gender: genderMapping[relation] || "Unknown",
  //     CustomerId: "",
  //     Disease: "",
  //     DiseaseDetails: "",
  //     errorMessage: { Age: "", RelationPersonName: "" },
  //   }))
  // );



  useEffect(() => {
    const mobNo = Cookies.get("MobileNumber");
    axios
      .get(`http://183.82.106.55:9100/register/fetch/${mobNo}`)
      .then((res) => {
        setCustomerDetails(res.data);
        setData((prevData) =>
          prevData.map((item) => ({
            ...item,
            CustomerId: res.data.customerId,
            RelationPersonName:
              item.Relation === "Self" ? res.data.fullName : item.RelationPersonName,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching customer details:", error);
      });
  }, []);

  const handleChange = (index, field, value) => {
    const updatedData = [...StoreData];
    updatedData[index][field] = value.trim();

    let errors = { Age: "", RelationPersonName: "" };

    if (field === "Age") {
      const age = updatedData[index].Age;
      if (age < 25 || age > 100 || isNaN(age)) {
        errors.Age = `Age must be between 25 and 100 for relation: ${updatedData[index].Relation}`;
      }
    }

    if (field === "RelationPersonName" && updatedData[index].Relation !== "Self") {
    // if (field === "RelationPersonName") {
      const name = updatedData[index].RelationPersonName;
      if (name && !/^[A-Za-z\s]+$/.test(name)) {
        errors.RelationPersonName = `Please enter a valid name for relation: ${updatedData[index].Relation}`;
      }
    }

    updatedData[index].errorMessage = errors;
    setData(updatedData);
      // Dispatch disease information with the relation index
  // if (field === "Disease") {
  //   dispatch(setDisease( ));
  // }
  };

  const updateDiseaseField = () => {
    const updatedStoreData = StoreData.map((data) => ({
      ...data, // Spread all existing properties
      Disease: data.Disease.trim() !== "" ? data.Disease : "No", // Ensure "No" is explicitly set
    }));
  
    setData(updatedStoreData);
  
    const hasAnyDisease = updatedStoreData.some((data) => data.Disease === "Yes");
    dispatch(setDisease(hasAnyDisease ? "Yes" : "No"));
  };
  
  
  const updateAgeField = () => {
    const updatedAgeData = StoreData.map((data) => ({
      ...data,
      Age: data.Age,
    }));
  
    // Dispatch the updated age data to Redux
    dispatch(setAge(updatedAgeData));
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();


    let isValid = true;
    const updatedData = [...StoreData];

    updatedData.forEach((data, index) => {
      let errors = { Age: "", RelationPersonName: "" };
      if (!/^\d{1,3}$/.test(data.Age)) {
        errors.Age = `Age must be between 25 and 100 for relation: ${data.Relation}`;
        isValid = false;
      }
      if (!/^[A-Za-z\s]+$/.test(data.RelationPersonName)) {
        errors.RelationPersonName = `Please enter a valid name for relation: ${data.Relation}`;
        isValid = false;
      }
      updatedData[index].errorMessage = errors;
    });

    setData(updatedData);

    if (isValid) {
      console.log(StoreData);
      updateDiseaseField();
      updateAgeField();
      // alert("Form Submitted!");

       // Navigate to the new page (update the path as per your route)
    navigate("/you"); // Replace with your desired route

    }
  };
  console.log(customerDetails);

  return (
   <div>
     <Nav/>
    <div>
    <div className="container mt-5">
      
      <h1 className="text-center mb-4">Customer and Relation Information</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {allRelations.map((relation, index) => (
            <div key={`${relation}-${index}`} className="col-md-4 mb-4">
              <div className="card" style={{ borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <div className="card-body">
                  <h5 className="card-title">Relation: {relation}</h5>

                  {/* {/* <p><strong>Gender:</strong> {StoreData[index].Gender}</p> */}
                   <p><strong>Gender:</strong> {StoreData[index]?.Gender || "Not Available"}</p>

                  {/* <p><strong>Customer ID:</strong> {StoreData[index].CustomerId}</p> */}

                  <div className="form-group">
                    <label htmlFor={`age-${index}`}>Age of the Relation:</label>
                    <input
                      type="text"
                      maxLength={3}
                      className="form-control"
                      id={`age-${index}`}
                      value={StoreData[index].Age}
                      onChange={(e) => handleChange(index, "Age", e.target.value)}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                    />
                    {StoreData[index].errorMessage.Age && (
                      <span className="text-danger">
                        {StoreData[index].errorMessage.Age}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor={`name-${index}`}>Relation Person's Name:</label>
                    {/* <input
                      type="text"
                      className="form-control"
                      id={`name-${index}`}
                      value={StoreData[index].RelationPersonName}
                      onChange={(e) =>
                        handleChange(index, "RelationPersonName", e.target.value)
                      }
                      onKeyPress={(e) => {
                        if (!/[a-zA-Z ]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                    />
                    {StoreData[index].errorMessage.RelationPersonName && (
                      <span className="text-danger">
                        {StoreData[index].errorMessage.RelationPersonName}
                      </span>
                    )} */}
                     <input
    type="text"
    className="form-control"
    id={`name-${index}`}
    value={
      StoreData[index].RelationPersonName
        ? StoreData[index].RelationPersonName.charAt(0).toUpperCase() +
          StoreData[index].RelationPersonName.slice(1)
        : ""
    }
    onChange={(e) => handleChange(index, "RelationPersonName", e.target.value)}
    required
  />
  {StoreData[index].errorMessage.RelationPersonName && (
    <span className="text-danger">{StoreData[index].errorMessage.RelationPersonName}</span>
  )}
                  </div>

                  <div className="form-group">
                    <label> Pre-Existing Disease:</label>
                    
                    <div className="d-flex align-items-center">
                      <div className="form-check mr-3">
                        <input
                          type="radio"
                          className="form-check-input"
                          id={`disease-yes-${index}`}
                          name={`disease-${index}`}
                          value="Yes"
                          checked={StoreData[index].Disease === "Yes"}
                          onChange={() => handleChange(index, "Disease", "Yes")}
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`disease-yes-${index}`}
                        >
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id={`disease-no-${index}`}
                          name={`disease-${index}`}
                          value="No"
                          checked={StoreData[index].Disease === "No"}
                          onChange={() => handleChange(index, "Disease", "No")}
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`disease-no-${index}`}
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  {StoreData[index].Disease === "Yes" && (
                    <div className="form-group mt-3">
                      <label htmlFor={`disease-details-${index}`}>
                        Disease Details:
                      </label>
                      <select
                        className="form-control"
                        id={`disease-details-${index}`}
                        value={StoreData[index].DiseaseDetails}
                        onChange={(e) =>
                          handleChange(index, "DiseaseDetails", e.target.value)
                        }
                        required
                      >
                        <option value="">Select a disease</option>
                        <option value="cancer">Cancer (all types)</option>
                        <option value="heart_disease">
                          Heart Disease (Coronary Artery Disease, Heart Attack,
                          etc.)
                        </option>
                        <option value="cancer">Cancer (all types)</option>
                 <option value="heart_disease">
                    Heart Disease (Coronary Artery Disease, Heart Attack, etc.)
                   </option>
                   <option value="stroke">Stroke</option>
                   <option value="diabetes">Diabetes (Type 1, Type 2)</option>
                   <option value="hypertension">
                     Hypertension (High Blood Pressure)
                   </option>
                   <option value="kidney_disease">Kidney Disease</option>
                   <option value="liver_disease">
                     Liver Disease (Hepatitis, Cirrhosis, etc.)
                   </option>
                   <option value="copd">
                     Chronic Obstructive Pulmonary Disease (COPD)
                   </option>
                   <option value="asthma">Asthma</option>
                   <option value="alzheimers">Alzheimer's Disease</option>
                   <option value="parkinsons">Parkinson's Disease</option>
                   <option value="multiple_sclerosis">Multiple Sclerosis</option>
                  <option value="epilepsy">Epilepsy</option>
                   <option value="tuberculosis">Tuberculosis</option>
                   <option value="rheumatoid_arthritis">
                     Rheumatoid Arthritis
                   </option>
                  <option value="osteoarthritis">Osteoarthritis</option>
                   <option value="ulcerative_colitis">Ulcerative Colitis</option>
                   <option value="crohns_disease">Crohn's Disease</option>
                   <option value="cystic_fibrosis">Cystic Fibrosis</option>
                   <option value="kidney_failure">Kidney Failure</option>
                   <option value="sickle_cell_anemia">Sickle Cell Anemia</option>
               <option value="hemophilia">Hemophilia</option>
                   <option value="hiv_aids">HIV/AIDS</option>
                 <option value="hiv_related_illnesses">
                    HIV-related Illnesses
                   </option>
                   <option value="obesity">Obesity</option>
                   <option value="anxiety_disorders">Anxiety Disorders</option>
                   <option value="depression">Depression</option>
                   <option value="schizophrenia">Schizophrenia</option>
                   <option value="bipolar_disorder">Bipolar Disorder</option>
                   <option value="migraine">Migraine</option>
                   <option value="autoimmune_disorders">
                    Autoimmune Disorders (e.g., Lupus, MS)
                   </option>
                     <option value="gallbladder_disease">
                     Gallbladder Disease
                   </option>
                   <option value="pneumonia">Pneumonia</option>
                  <option value="meningitis">Meningitis</option>
                   <option value="pneumothorax">
                    Pneumothorax (Collapsed Lung)
                  </option>
                   <option value="sepsis">Sepsis</option>
                   <option value="blood_disorders">
                    Blood Disorders (e.g., Leukemia, Lymphoma)
                   </option>
                   <option value="sleep_apnea">Sleep Apnea</option>
                  <option value="digestive_disorders">
                    Digestive Disorders (e.g., GERD, IBS)
                   </option>
                  <option value="endometriosis">Endometriosis</option>
                   <option value="pcos">Polycystic Ovary Syndrome (PCOS)</option>
                  <option value="chronic_sinusitis">Chronic Sinusitis</option>
                  <option value="osteoporosis">Osteoporosis</option>
                   <option value="fibromyalgia">Fibromyalgia</option>
                  <option value="spondylitis">Spondylitis</option>
                   <option value="chemotherapy">
                     Cancer-related treatments (e.g., chemotherapy)
                   </option>
                   <option value="tuberculosis_tb">Tuberculosis (TB)</option>
                   <option value="hepatitis_b_c">Hepatitis B and C</option>
                   <option value="respiratory_diseases">
                     Respiratory Diseases (e.g., Pneumonia, Bronchitis)
                  </option>
                   <option value="pancreatitis">Pancreatitis</option>
                   <option value="chronic_pain_syndromes">
                     Chronic Pain Syndromes
                   </option>
                   <option value="infectious_diseases">
                     Infectious Diseases (e.g., Malaria, Dengue, COVID-19)
                  </option>
                  <option value="others">others</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
    </div>
    <Footer/>
    </div>
  );
}
export default Relation;
