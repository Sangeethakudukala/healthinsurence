import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Relation.css";
import Nav from "../../nav/Nav";
import Footer from "../../nav/Footer";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setDisease, setAge, setStoreDataOfUser } from "../../../../storage/relationsSlice";

function Relation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [customerDetails, setCustomerDetails] = useState({});
  const [relationPage, setRelationPage] = useState([]);

  const relationData = useSelector((state) => state.relations.selectedRelations);
  const sonData = [];
  const daughterData = [];

  const allRelations = [...relationData, ...sonData, ...daughterData].filter((relation) => relation);

  // Gender mapping for various relations
  const genderMapping = {
    Self: Cookies.get("UserDetails")
      ? Cookies.get("UserDetails").charAt(0).toUpperCase() + Cookies.get("UserDetails").slice(1)
      : "Unknown",
    Husband: "Male",
    Wife: "Female",
    Mother: "Female",
    Father: "Male",
    GrandMother: "Female",
    GrandFather: "Male",
    'Mother-In-Law': "Female",
    'Father-In-Law': "Male",
    Son: "Male",
    Daughter: "Female",
  };

  const ageValidationMap = {
    "Self": { min: 25, max: 100 },
    "Mother": { min: 43, max: 118 },
    "Father": { min: 43, max: 118 },
    "Grandmother": { min: 61, max: 136 },
    "Grandfather": { min: 61, max: 136 },
    "Mother-in-Law": { min: 43, max: 118 },
    "Father-in-Law": { min: 43, max: 118 },
    "Son": { min: 1, max: 82 },
    "Daughter": { min: 1, max: 82 },
    "Husband": { min: 25, max: 100 },
    "Wife": { min: 25, max: 100 },
  };
  const [ischecked, setIsChecked] = useState(false);

  // Resolves the gender based on the relation
  // const resolvedGender = (relation) => genderMapping[relation] || "Not Available";
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
    allRelations.map((relation) => ({
      Relation: relation,
      Age: "",
      RelationPersonName: "",
      Gender: resolvedGender(relation),
      CustomerId: "",
      Disease: "",
      DiseaseDetails: "",
      errorMessage: { Age: "", RelationPersonName: "" },
    }))
  );

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
            RelationPersonName: item.Relation === "Self" ? res.data.fullName : item.RelationPersonName,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching customer details:", error);
      });
  }, []);

  const handleChange = (index, field, value) => {
    const updatedData = [...StoreData];
    updatedData[index][field] = value.trim(); // Remove any extra spaces

    let errors = { Age: "", RelationPersonName: "" }; // Initialize errors

    // Validate Age
    if (field === "Age") {
      const age = updatedData[index].Age;
      const relation = updatedData[index].Relation;
      //.log(relation,age);
      // Validate age dynamically based on relation
      const relationAgeRange = ageValidationMap[relation];
      if (relationAgeRange) {
        // General age validation based on the age map
        if (isNaN(age) || age < relationAgeRange.min || age > relationAgeRange.max) {
          errors.Age = `Age must be between ${relationAgeRange.min} and ${relationAgeRange.max} for relation: ${relation}`;
        }

        // Additional checks based on the relationship
        if (relation === "Son" || relation === "Daughter") {
          const selfAge = updatedData[index].SelfAge;
          //.log(selfAge,age,relation)
          if (age > 50) {
            errors.Age = `Age must be between 0 and 50 for ${relation}`;
          } else if (age <= (selfAge - 18)) {
            errors.Age = `${relation} must be at least 20 years younger than the father.`;
          }
        }

        if (relation === "Father" || relation === "Mother") {
          const selfAge = updatedData[index].SelfAge;
          if (age < selfAge + 25) {
            errors.Age = `${relation} must be at least 25 years older than you.`;
          }
        }

        if (relation === "Grandmother" || relation === "Grandfather") {
          const selfAge = updatedData[index].SelfAge;
          if (age < selfAge + 55) {
            errors.Age = `${relation} must be at least 55 years older than you. `;
          }
        }

        if (relation === "Mother-in-Law" || relation === "Father-in-Law") {
          const selfAge = updatedData[index].SelfAge;
          if (age < selfAge + 40) {
            errors.Age = `${relation} must be at least 40 years older than you.`;
          }
        }

        if (relation === "Uncle" || relation === "Aunt") {
          const selfAge = updatedData[index].SelfAge;
          if (age <= selfAge + 5) {
            errors.Age = `${relation} must be at least 5 years older than you.`;
          }
        }

        if (relation === "Brother" || relation === "Sister") {
          const selfAge = updatedData[index].SelfAge;
          if (age > 50) {
            errors.Age = `${relation} age cannot be above 50.`;
          } else if (age >= selfAge) {
            errors.Age = `${relation} should be younger than you.`;
          }
        }

        if (relation === "GrandSon" || relation === "GrandDaughter") {
          const selfAge = updatedData[index].SelfAge;
          if (age > 50) {
            errors.Age = `${relation} age must be between 0 and 50. `;
          } else if (age >= selfAge - 55) {
            errors.Age = `${relation} should be younger than the Grandparent (at least 55 years younger).`;
          }
        }
      }
    }

    // Validate RelationPersonName
    if (field === "RelationPersonName") {
      const name = updatedData[index].RelationPersonName;
      // Validate name to contain only alphabets and spaces
      if (name && !/^[A-Za-z\s]+$/.test(name)) {
        errors.RelationPersonName = `Please enter a valid name for relation: ${updatedData[index].Relation}`;
      }
    }

    // Update error message and state
    updatedData[index].errorMessage = errors;
    setData(updatedData); // Update state with the new data
  };

  const updateDiseaseField = () => {
    const updatedStoreData = StoreData.map((data) => ({
      ...data,
      Disease: data.Disease.trim() !== "" ? data.Disease : "No",
    }));

    setData(updatedStoreData);
    const hasAnyDisease = updatedStoreData.some((data) => data.Disease === "Yes");
    dispatch(setDisease(hasAnyDisease ? "Yes" : "No"));
  };

  const updateAgeField = () => {
    dispatch(setAge(StoreData.map((data) => ({ Age: data.Age, Relation: data.Relation }))));
  };

  const [errorMessages, setErrorMessages] = useState([])

  const handleCheck = (event) => {
    event.preventDefault();

    let isValid = true;
    const updatedData = [...StoreData]; // Make a copy of the StoreData array to manipulate
    const errorMessages = []; // Initialize a new array to store error messages

    for (let i = 0; i < StoreData.length; i++) {
      const relationI = StoreData[i]; // The relation at index i
      const ageI = relationI.Age; // Consider relation age x
      const relationNameI = relationI.Relation;

      const relationErrors = []; // Initialize an empty array for the current relation's errors

      // Check for Self or Wife to validate their relationships with other members
      if (relationNameI === 'Self' || relationNameI === 'Wife' || relationNameI === 'Husband') {
        const selfAge = parseInt(ageI); // Example: Age for Self or Wife

        for (let j = 0; j < StoreData.length; j++) {
          if (i !== j) { // Avoid comparing the same relation with itself
            const relationJ = StoreData[j]; // The relation at index j
            const ageJ = parseInt(relationJ.Age);
            const relationNameJ = relationJ.Relation;

            // Check against Grandmother or Grandfather (at least 36 years older)
            if (relationNameJ === 'Grandmother' || relationNameJ === 'Grandfather') {
              const minAgeDiff = selfAge + 36; // Self or Wife should be 36 years younger than Grandparent
              if (ageJ < minAgeDiff) {
                isValid = false;
                relationErrors.push(`${relationNameI} must maintain a gap of at least 36 years from ${relationNameJ}.`);
              }
            }
            // Check against Father or Mother (at least 18 years older)
            else if (relationNameJ === 'Father' || relationNameJ === 'Mother' || relationNameJ === 'Mother-in-Law' || relationNameJ === 'Father-in-Law') {
              const minAgeDiff = selfAge + 18; // Self or Wife should be 18 years younger than Father/Mother
              if (ageJ < minAgeDiff) {
                isValid = false;
                relationErrors.push(`${relationNameI} must maintain a gap of at least 18 years from ${relationNameJ}.`);
              }
            }
            // Check against Son or Daughter (should be at least 18 years older)
            else if (relationNameJ === 'Son' || relationNameJ === 'Daughter') {
              const minAgeDiff = selfAge - 18; // Self or Wife should be 18 years older than Son/Daughter
              if (minAgeDiff < ageJ) {
                isValid = false;
                relationErrors.push(`${relationNameI} must maintain a gap of at least 18 years from ${relationNameJ}.`);
              }
            }
          }
        }
      }
      // Check for Father or Mother (18 years difference from other relations)
      else if (relationNameI === 'Father' || relationNameI === 'Mother' || relationNameI === 'Mother-in-Law' || relationNameI === 'Father-in-Law') {
        const fatherAge = parseInt(ageI); // Age for Father or Mother

        for (let j = 0; j < StoreData.length; j++) {
          if (i !== j) { // Avoid comparing the same relation with itself
            const relationJ = StoreData[j];
            const ageJ = parseInt(relationJ.Age);
            const relationNameJ = relationJ.Relation;

            // Check against Grandmother or Grandfather (should be at least 18 years older)
            if (relationNameJ === 'Grandmother' || relationNameJ === 'Grandfather') {
              const minAgeDiff = fatherAge + 18;
              if (ageJ < minAgeDiff) {
                isValid = false;
                relationErrors.push(`${relationNameI} must maintain a gap of at least 18 years from ${relationNameJ}.`);
              }
            }
            // Check against Self or Wife (should be at least 18 years younger)
            else if (relationNameJ === 'Self' || relationNameJ === 'Wife') {
              const minAgeDiff = fatherAge - 18;
              if (minAgeDiff < ageJ) {
                isValid = false;
                relationErrors.push(`${relationNameI} must maintain a gap of at least 18 years from ${relationNameJ}.`);
              }
            }
            // Check against Son or Daughter (should be at least 36 years older)
            else if (relationNameJ === 'Son' || relationNameJ === 'Daughter') {
              const minAgeDiff = fatherAge - 36;
              if (minAgeDiff < ageJ) {
                isValid = false;
                relationErrors.push(`${relationNameI} must maintain a gap of at least 36 years from ${relationNameJ}.`);
              }
            }
          }
        }
      }
      else if (relationNameI === 'Grandmother' || relationNameI === 'Grandfather') {
        const grandparentAge = parseInt(ageI); // Age for Grandmother or Grandfather

        for (let j = 0; j < StoreData.length; j++) {
          if (i !== j) { // Avoid comparing the same relation with itself
            const relationJ = StoreData[j];
            const ageJ = parseInt(relationJ.Age);
            const relationNameJ = relationJ.Relation;

            // Check against Self or Wife (at least 36 years younger)
            if (relationNameJ === 'Self' || relationNameJ === 'Wife') {
              const minAgeDiff = grandparentAge;
              const selfAge = ageJ;
              const dif = grandparentAge - selfAge
              console.log(minAgeDiff, ageJ)
              if (36 > dif) {
                isValid = false;
                relationErrors.push(`${relationNameI} must maintain a gap of at least 36 years from ${relationNameJ}.`);
              }
            }
            // Check against Father or Mother (at least 18 years older)
            else if (relationNameJ === 'Father' || relationNameJ === 'Mother' || relationNameJ === 'Mother-in-Law' || relationNameJ === 'Father-in-Law') {
              const minAgeDiff = grandparentAge;
              const fatherAge = ageJ;
              const dif1 = grandparentAge - fatherAge;
              if (18 > dif1) {
                isValid = false;
                relationErrors.push(`${relationNameI} must maintain a gap of at least 18 years from ${relationNameJ}.`);
              }
            }
            // Check against Son or Daughter (should be at least 36 years older)
            else if (relationNameJ === 'Son' || relationNameJ === 'Daughter') {
              const minAgeDiff = grandparentAge - 36;
              if (minAgeDiff < ageJ) {
                isValid = false;
                relationErrors.push(`${relationNameI} must maintain a gap of at least 36 years from ${relationNameJ}.`);
              }
            }
          }
        }
      }
      else if (relationNameI === 'Son' || relationNameI === 'Daughter') {
        const childAge = parseInt(ageI); // Age for Grandmother or Grandfather

        for (let j = 0; j < StoreData.length; j++) {
          if (i !== j) { // Avoid comparing the same relation with itself
            const relationJ = StoreData[j];
            const ageJ = parseInt(relationJ.Age);
            const relationNameJ = relationJ.Relation;

            // Check against Self or Wife (at least 36 years younger)
            if (relationNameJ === 'Grandmother' || relationNameJ === 'Grandfather') {
              const minAgeDiff = childAge + 54;
              console.log(minAgeDiff, ageJ)
              if (ageJ < minAgeDiff) {
                isValid = false;
                relationErrors.push(`${relationNameI} must maintain a gap of at least 54 years from ${relationNameJ}.`);
              }
            }
            // Check against Father or Mother (at least 18 years older)
            else if (relationNameJ === 'Father' || relationNameJ === 'Mother' || relationNameJ === 'Mother-in-Law' || relationNameJ === 'Father-in-Law') {
              const minAgeDiff = childAge + 36;
              console.log(minAgeDiff, ageJ)
              if (ageJ < minAgeDiff) {
                isValid = false;
                relationErrors.push(`${relationNameI} must maintain a gap of at least 36 years from ${relationNameJ}.`);
              }
            }
            if (relationNameJ === 'Self' || relationNameJ === 'Wife') {
              const minAgeDiff = childAge + 18;
              console.log(minAgeDiff, ageJ)
              if (ageJ < minAgeDiff) {
                isValid = false;
                relationErrors.push(`${relationNameI} must maintain a gap of at least 18 years from ${relationNameJ}.`);
              }
            }
          }
        }
      }

      // Store errors for the current relation in the errorMessages array
      errorMessages[i] = relationErrors;

      // If there are errors for this relation, attach them to the relation's object
      if (relationErrors.length > 0) {
        updatedData[i].errorMessage = relationErrors.join(', '); // You can format this as needed
      }
    }
    setData(updatedData); // Update the state with the updated data after checks
    setErrorMessages(errorMessages); // Update error messages state

    if (isValid) {
      setIsChecked(true); // If everything is valid, proceed with the submission
    } else {
      // Optionally, show some error feedback if the form is not valid
      console.log(errorMessages);
      alert("There are validation errors. Please check the age gaps.");
    }
  };

  const userdata = useSelector((state) => state.relations.storeDataOfUser);

  const handleSubmit = (event) => {
    event.preventDefault();

    let isValid = true;
    const updatedData = [...StoreData];

    updatedData.forEach((data, index) => {
      let errors = { Age: "", RelationPersonName: "" };

      const relation = data.Relation;
      const age = data.Age;

      // Validate age for each relation dynamically
      const relationAgeRange = ageValidationMap[relation];
      if (relationAgeRange) {
        if (age < relationAgeRange.min || age > relationAgeRange.max || isNaN(age)) {
          errors.Age = `Age must be between ${relationAgeRange.min} and ${relationAgeRange.max} for relation: ${relation}`;
          isValid = false;
        }
      }

      if (!/^[A-Za-z\s]+$/.test(data.RelationPersonName)) {
        errors.RelationPersonName = `Please enter a valid name for relation: ${data.Relation}`;
        isValid = false;
      }

      updatedData[index].errorMessage = errors;
    });

    setData(updatedData);

    if (isValid) {
      // updateDiseaseField();
      // updateAgeField();
      // navigate("/you");
      // setIsChecked(true)
      handleCheck(event);
    }
    if (ischecked) {
      updateDiseaseField();
      updateAgeField();
      dispatch(setStoreDataOfUser(StoreData));

      console.log(userdata, StoreData);
      console.log(sessionStorage.getItem('typeOfRelation'));

      sessionStorage.setItem("userAgeData", JSON.stringify(StoreData))

      navigate("/you");
    }
  };

  useEffect(() => {
    const storedInsuranceType = sessionStorage.getItem("typeOfInsurance");
    const currentInsuranceType = storedInsuranceType;
    console.log(currentInsuranceType)
    if (currentInsuranceType === "Individual") {
      // Handle individual-specific logic here
      const data = sessionStorage.getItem("selectedRelation");
      const ipdata = data ? JSON.parse(data) : [];
      console.log(ipdata);

      let selectedRelation = ipdata.length > 0 ? [ipdata[0]] : []; // Allow only the first relation
      console.log("Selected relation for individual:", selectedRelation);
      // Set data based on selectedRelation
      const userAgeData = sessionStorage.getItem("userAgeData");
      const parsedUserAgeData = userAgeData ? JSON.parse(userAgeData) : [];

      const filteredData = parsedUserAgeData.filter((element) =>
        selectedRelation.includes(element.Relation)
      );

      if (filteredData.length > 0) {
        console.log("Filtered data:", filteredData);
        setData(filteredData); // Set the state with filtered data
      } else {
        console.log("No matching data found for selectedRelation.");
        // setData([]); // Optionally clear the state if no match
      }

      // parsedUserAgeData.forEach((elements) => {
      //   if (elements.Relation == selectedRelation) { console.log(elements); }
      // })

    }
    else {
      // Handle family-specific logic here
      const data1 = sessionStorage.getItem("selectedRelation");
      const ipdata1 = data1 ? JSON.parse(data1) : [];
      console.log(ipdata1);

      const userAgeData = sessionStorage.getItem("userAgeData");
      const parsedUserAgeData = userAgeData ? JSON.parse(userAgeData) : [];

      console.log(parsedUserAgeData, StoreData)
      const newMultipleRelationUserData = [];
      allRelations.forEach((relation) => {
        console.log(relation);

        const defaultData = {
          Age: "",
          Disease: "",
          DiseaseDetails: "",
          Gender: resolvedGender(relation),
          Relation: relation, // This will be set dynamically
          RelationPersonName: "",
          errorMessage: { Age: "", RelationPersonName: "" },
        };

        const filteredData = parsedUserAgeData.filter((element) =>
          relation.includes(element.Relation)
        );
        if (filteredData.length > 0) {
          // Add the filtered data to the main array
          newMultipleRelationUserData.push(...filteredData);
        } else {
          // Add default data for the missing relation
          const missingRelationData = { ...defaultData, Relation: relation };
          console.log(`No data found for relation "${relation}". Adding default data:`, missingRelationData);
          newMultipleRelationUserData.push(missingRelationData);
        }
      })
      console.log(newMultipleRelationUserData)
      setData(newMultipleRelationUserData)

      // StoreData.forEach((element)=>{
      //   // console.log(element)
      //  parsedUserAgeData.forEach((elements)=>{
      //   //  console.log(elements)/
      //    if(element.Relation == elements.Relation){ console.log(element)}
      //   })
      // })
    }
  }, []);

  console.log(relationData, allRelations, StoreData);

  return (
    <div>
      <Nav/>
      <div className="container mt-5">
      {/* <h1 className="text-center mb-4 font-bold">Insured Members Details</h1> */}
      <h1 className="text-center mb-4"> <strong>Insured Members Details</strong> </h1>

        <form onSubmit={handleSubmit}>
          <div className="row">
            {StoreData.map((data, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5>Relation: {data.Relation}</h5>
                    <p><strong>Gender:</strong> {data.Gender}</p>
                    <div className="form-group">
                      <label>Age:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={data.Age}
                        onChange={(e) => handleChange(index, "Age", e.target.value)}
                        required
                      />
                      {data.errorMessage.Age && <span className="text-danger">{data.errorMessage.Age}</span>}
                    </div>

                    <div className="form-group">
                      <label>Relation Person's Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={data.RelationPersonName}
                        onChange={(e) => handleChange(index, "RelationPersonName", e.target.value)}
                        required
                      />
                      {data.errorMessage.RelationPersonName && <span className="text-danger">{data.errorMessage.RelationPersonName}</span>}
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
                          <option value="" disabled>Select a disease</option>
                          <option value="cancer">Cancer (all types)</option>
                          <option value="heart_disease">
                            Heart Disease (Coronary Artery Disease, Heart Attack,Stroke,etc.)
                          </option>
                          <option value="diabetes">Diabetes (Type 1, Type 2)</option>
                          <option value="hypertension">
                            Hypertension (High Blood Pressure)
                          </option>
                          <option value="kidney_disease">Kidney Disease(Kidney Failure)</option>
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
                          <option value="rheumatoid_arthritis">Rheumatoid Arthritis</option>
                          <option value="osteoarthritis">Osteoarthritis</option>
                          <option value="ulcerative_colitis">Ulcerative Colitis</option>
                          <option value="crohns_disease">Crohn's Disease</option>
                          <option value="cystic_fibrosis">Cystic Fibrosis</option>
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
                            Autoimmune Disorders (e.g :Lupus, MS)
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
          {/* <button type="submit" className="btn btn-primary">Submit</button> */}
          < button type="submit" className="btn btn-primary">{ischecked ? (<>Proceed</>) : (<>check</>)}</button>
        </form>
        {/* Optionally, you can display all errors globally here */}
        {errorMessages.length > 0 && (
          < div style={{ color: 'red', marginTop: '20px' }}>
            < h3>All Validation Errors:</h3>
            {errorMessages.map((errors, index) => (
              < div key={index}>
                {errors.length > 0 && (
                  < div>
                    < h4>{StoreData[index].Relation}</h4>
                    {errors.map((error, errorIndex) => (
                      < p key={errorIndex}>{error}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
export default Relation;

