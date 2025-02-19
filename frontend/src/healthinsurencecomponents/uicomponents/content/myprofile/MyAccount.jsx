import React, { useState, useEffect } from "react";
import Nav from "../../nav/Nav";
import Footer from "../../nav/Footer";
import axios from "axios";
import Cookies from "js-cookie";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyAccount = () => {
  const [editMode, setEditMode] = useState({});
  const [user, setUser] = useState({});
  const [tempUser, setTempUser] = useState({});
  const [errors, setErrors] = useState({});
  const mobileNumber = Cookies.get("MobileNumber");

  useEffect(() => {
    if (mobileNumber) {
      axios.get(`http://183.82.106.55:9100/register/fetch/${mobileNumber}`)
        .then((res) => {
          const userData = {
            fullName: res.data.fullName || "",
            mobile: res.data.mobile || mobileNumber,
            email: res.data.email || "",
            gender: res.data.gender || "",
            customerId: res.data.customerId || "",
          };
          setUser(userData);
          setTempUser(userData);
          return axios.get(`http://183.82.106.55:9100/policy/customerdetails/${res.data.customerId}`);
        })
        .then((res1) => {
          const addressData = {
            houseNumber: res1.data.houseNo || "",
            street: res1.data.street || "",
            city: res1.data.city || "",
            state: res1.data.state || "",
            pincode: res1.data.pincode || "",
          };
          setUser((prev) => ({ ...prev, ...addressData }));
          setTempUser((prev) => ({ ...prev, ...addressData }));
        })
        .catch((err) => console.error("Error fetching user details:", err));
    }
  }, [mobileNumber]);

  const validateForm = (field, value) => {
    let errorMsg = "";
    if (field === "fullName" && (!value.trim() || value.length < 3)) {
      errorMsg = "Full Name must be at least 3 characters.";
    }
    if (field === "mobile" && !/^\d{10}$/.test(value)) {
      errorMsg = "Mobile Number must be 10 digits.";
    }
    if (field === "email" && !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value)) {
      errorMsg = "Enter a valid lowercase email.";
    }
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    return !errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUser({ ...tempUser, [name]: value });
  };

  const updateEmail = async (customerId,email) => {
    try {
      const response = await axios.put(
        `http://183.82.106.55:9100/register/update/email/${customerId}?email=${encodeURIComponent(email)}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // toast.success("Email updated successfully!");
      console.log("Updated data:", response);
    } catch (error) {
      toast.error("Error updating email.");
      console.log("Error updating email:", error);
    }
  };

  // Corrected function to update mobile number
const updateMobileNumber = async (customerId, mobileNo) => {
  try {
    // Ensure proper URL encoding for mobile number
    const response = await axios.put(
      `http://183.82.106.55:9100/register/update/mobile?customerId=${customerId}&mobileNo=${encodeURIComponent(mobileNo)}`,
      {}, // Empty request body
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    // toast.success("Mobile number updated successfully!");
    console.log("Updated data:", response.data);
    Cookies.set("MobileNumber",mobileNo);
  } catch (error) {
    toast.error("Error updating mobile number.");
    console.error("Error updating mobile number:", error.message || error);
  }
};

  const updateFullName = async (customerId, fullName) => {
    try {
      const response = await axios.put(
        `http://183.82.106.55:9100/register/update/name/${customerId}?fullName=${encodeURIComponent(fullName)}`,
        {}, // Empty request body
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // toast.success("fullname updated successfully!");
      console.log("Updated data:", response.data);
    } catch (error) {
      toast.error("Error updating fullname.");
      console.log("Error updating fullname:", error);
    }
  };
  
  const updateAddress = async (customerId) => {
    const updatedData = {
      "houseNo": tempUser.houseNumber,
      "street": tempUser.street,
      "city": tempUser.city,
      "state": tempUser.state,
      "pincode": tempUser.pincode,
      "customerId": user.customerId,
    };

    try {
      const response = await axios.put(
        `http://183.82.106.55:9100/policy/address/${customerId}`,
        updatedData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Address details updated successfully!");
      // setEditMode((prev) => ({ ...prev, [field]: false }));
      console.log("Updated data:", response);
    } catch (error) {
      // toast.error("Error updating address details.");
      console.log("Error updating address:", error);
    }
  };
 
// Corrected handleSave logic
const handleSave = async (field) => {
  try {
    if (field === "address") {
      console.log("Updating address for Customer ID:", user.customerId);
      await updateAddress(user.customerId);
      toast.success("Address updated successfully!");
    } 
    else if (field === "email") {
      console.log("Updating email for Customer ID:", user.customerId);
      await updateEmail(user.customerId, tempUser.email);  // Use tempUser.email as it's the updated value
      toast.success("Email updated successfully!");
    } 
    else if (field === "mobile") {
      console.log("Updating mobile number for Customer ID:", user.customerId);
      await updateMobileNumber(user.customerId, tempUser.mobile); // Use tempUser.mobile as it's the updated value
      toast.success("Mobile number updated successfully!");
    } 
    else if (field === "fullName") {
      console.log("Updating mobile number for Customer ID:", user.customerId);
      await updateFullName(user.customerId, tempUser.fullName); // Use tempUser.mobile as it's the updated value
      toast.success("FullName updated successfully!");
    } 
    else if (validateForm(field, tempUser[field])) {
      setUser(tempUser);
      toast.success(`${field} updated successfully!`);
    }

    setEditMode((prev) => ({ ...prev, [field]: false })); // Exit edit mode after saving
  } catch (error) {
    toast.error(`Error updating ${field}. Please try again.`);
    console.error(`Error updating ${field}:`, error.message || error);
  }
};

  const handleCancel = (field) => {
    setTempUser(user);
    setEditMode((prev) => ({ ...prev, [field]: false }));
  };

  // return (
  //   <div>
  //     <Nav />
  //     <div className="container w-50 mt-4">
  //       {/* My Account Section */}
  //       <div className="card p-4 shadow-sm mb-4 mx-auto">
  //         <h2 className="text-center fw-bold">User Details</h2>
  //         <div className="card-body">
  //           {["fullName", "gender", "mobile", "email"].map((field) => (
  //             <div className="mb-3" key={field}>
  //               <label className="form-label fw-bold">
  //                 {field.charAt(0).toUpperCase() + field.slice(1)}
  //               </label>
  //               <div className="d-flex">
  //                 <input
  //                   type="text"
  //                   className="form-control"
  //                   name={field}
  //                   value={tempUser[field]}
  //                   disabled={!editMode[field]}
  //                   onChange={handleChange}
  //                   style={{ width: "90%", height: "35px" }}
  //                 />
  //                 {editMode[field] ? (
  //                   <>
  //                     <button className="btn btn-primary ms-2" onClick={() => handleSave(field)}>
  //                       <FaCheck />
  //                     </button>
  //                     <button className="btn btn-secondary ms-2" onClick={() => handleCancel(field)}>
  //                       <FaTimes />
  //                     </button>
  //                   </>
  //                 ) : (
  //                   <button className="btn btn-success ms-2" onClick={() => setEditMode({ ...editMode, [field]: true })}>
  //                     <FaEdit />
  //                   </button>
  //                 )}
  //               </div>
  //               {errors[field] && <small className="text-danger">{errors[field]}</small>}
  //             </div>
  //           ))}
  //         </div>
  //       </div>

  //       {/* Address Section */}
  //       {user.houseNumber || user.street || user.city || user.state || user.pincode ? (
  //         <div className="card p-4 shadow-sm mx-auto">
  //           <h2 className="text-center fw-bold">Address Details</h2>
  //           <div className="card-body">
  //             {["houseNumber", "street", "state", "city", "pincode"].map((field) => (
  //               <div className="mb-3" key={field}>
  //                 <label className="form-label fw-bold">
  //                   {field.charAt(0).toUpperCase() + field.slice(1)}
  //                 </label>
  //                 <div className="d-flex">
  //                   <input
  //                     type="text"
  //                     className="form-control"
  //                     name={field}
  //                     value={tempUser[field]}
  //                     disabled={!editMode.address}
  //                     onChange={handleChange}
  //                     style={{ width: "90%", height: "35px" }}
  //                   />
  //                 </div>
  //               </div>
  //             ))}
  //             {editMode.address ? (
  //               <>
  //                 <button className="btn btn-primary ms-2" onClick={() => handleSave("address")}>
  //                   <FaCheck />
  //                 </button>
  //                 <button className="btn btn-secondary ms-2" onClick={() => handleCancel("address")}>
  //                   <FaTimes />
  //                 </button>
  //               </>
  //             ) : (
  //               <button className="btn btn-success ms-2" onClick={() => setEditMode({ ...editMode, address: true })}>
  //                 <FaEdit />
  //               </button>
  //             )}
  //           </div>
  //         </div>
  //       ) : (
  //         <div className="p-1 text-center fw-bold mb-4 w-75 mx-auto"
  //           style={{ backgroundColor: "#dc3545", color: "white", borderRadius: "5px" }}>
  //           No Address Found.
  //         </div>
  //       )}
  //     </div>
  //     <Footer />
  //   </div>
  // );



  return (
    <div>
      <Nav />
      <div className="container w-50 mt-4">
        {/* My Account Section */}
        <div className="card p-4 shadow-sm mb-4 mx-auto">
          <h2 className="text-center fw-bold">User Details</h2>
          <div className="card-body">
            {["fullName", "gender", "mobile", "email"].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label fw-bold">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control"
                    name={field}
                    value={tempUser[field]}
                    disabled={field === "gender" || !editMode[field]}
                    onChange={handleChange}
                    style={{ width: "90%", height: "35px" }}
                  />
                  {field !== "gender" && (editMode[field] ? (
                    <>
                      <button className="btn btn-primary ms-2" onClick={() => handleSave(field)}>
                        <FaCheck />
                      </button>
                      <button className="btn btn-secondary ms-2" onClick={() => handleCancel(field)}>
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-success ms-2" onClick={() => setEditMode({ ...editMode, [field]: true })}>
                      <FaEdit />
                    </button>
                  ))}
                </div>
                {errors[field] && <small className="text-danger">{errors[field]}</small>}
              </div>
            ))}
          </div>
        </div>

        {/* Address Section */}
        {user.houseNumber || user.street || user.city || user.state || user.pincode ? (
          <div className="card p-4 shadow-sm mx-auto">
            <h2 className="text-center fw-bold">Address Details</h2>
            <div className="card-body">
              {["houseNumber", "street", "state", "city", "pincode"].map((field) => (
                <div className="mb-3" key={field}>
                  <label className="form-label fw-bold">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control"
                      name={field}
                      value={tempUser[field]}
                      disabled={!editMode.address}
                      onChange={handleChange}
                      style={{ width: "90%", height: "35px" }}
                    />
                  </div>
                </div>
              ))}
              {editMode.address ? (
                <>
                  <button className="btn btn-primary ms-2" onClick={() => handleSave("address")}>
                    <FaCheck />
                  </button>
                  <button className="btn btn-secondary ms-2" onClick={() => handleCancel("address")}>
                    <FaTimes />
                  </button>
                </>
              ) : (
                <button className="btn btn-success ms-2" onClick={() => setEditMode({ ...editMode, address: true })}>
                  <FaEdit />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-1 text-center fw-bold mb-4 w-75 mx-auto"
            style={{ backgroundColor: "#dc3545", color: "white", borderRadius: "5px" }}>
            No Address Found.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default MyAccount;






