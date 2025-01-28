import { Modal, Toast } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Box, Button, Typography, TextField } from "@mui/material";
import p1 from "../../images/p3.jpeg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";


function Header() {
    const navigate = useNavigate('');
    const [showModal, setShowModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [isOtpSentEmail, setIsOtpSentEmail] = useState(false)
    const [isOtpSentPhoneNumber, setIsOtpSentPhoneNumber] = useState(false)
    const [values, setValues] = useState({
        username: "",
        email: "",
        phoneNumber1: "",
        gender: ""
    });
    const [values1, setValues1] = useState({
        phoneNumber: ""
    });
    const [errors, setErrors] = useState({
        username: "",
        phoneNumber1: "",
        email: "",
    });
    const [errors1, setErrors1] = useState({

        phoneNumber: "",

    });
    const [serverEmailOtp, setServerEmailOtp] = useState("");
    const [serverMobileOtp, setServerMobileOtp] = useState("")
    const [logoinOtp, setLoginOtp] = useState('');
    const [isMobileNumberVerified, setIsMObileNumberVerified] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [otpEmail, setOtpEmail] = useState(["", "", "", ""]);
    const [otpPhoneNumber, setOtpPhoneNumber] = useState(["", "", "", ""])


    const [resendTimer, setResendTimer] = useState(0);
    const [resendTimerEmail, setResendTimerEmail] = useState(0);
    const [resendTimerPhoneNumber, setResendTimerPhoneNumber] = useState(0);



    const [clicked, isClicked] = useState(true)
    const [clickedEmail, isClickedEmail] = useState(true)
    const [clickedPhoneNumber, isClickedPhoneNumber] = useState(true)

    const usernamePattern = /^[A-Za-z][A-Za-z. ]{1,50}[A-Za-z. ]$/;
    const phonePattern = /^[6-9][0-9]{9}$/;
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    const openModal = () => setShowModal(true);
    const closeModal = () => {
        setShowModal(false);
        setIsLogin(true);
        setValues1({ phoneNumber: "" })
        setErrors1({ phoneNumber: "" })
        setValues({ username: "", phoneNumber1: "", email: "" });
        setErrors({ username: "", phoneNumber1: "", email: "" });
        setOtp(["", "", "", ""]);
        setResendTimer(0);
        setIsOtpSent(false); // Reset OTP visibility

        setOtpEmail(["", "", "", ""]);
        setResendTimerEmail(0);
        setIsOtpSentEmail(false);

        setOtpPhoneNumber(["", "", "", ""])
        setResendTimerPhoneNumber(0);
        setIsOtpSentPhoneNumber(false);
    };

    useEffect(() => {
        let timer;
        if (resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer); // Cleanup timer on unmount or when timer ends
    }, [resendTimer]);

    useEffect(() => {
        let timerEmail;
        if (resendTimerEmail > 0) {
            timerEmail = setInterval(() => {
                setResendTimerEmail((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timerEmail); // Cleanup timer on unmount or when timer ends
    }, [resendTimerEmail]);

    useEffect(() => {
        let timerPhoneNumber;
        if (resendTimerPhoneNumber > 0) {
            timerPhoneNumber = setInterval(() => {
                setResendTimerPhoneNumber((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timerPhoneNumber); // Cleanup timer on unmount or when timer ends
    }, [resendTimerPhoneNumber]);

    const [verifiedLoginMobileNumber, setverifiedLoginMobileNumber] = useState(true)

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setValues1({ ...values1, [name]: value })

    //     if (name === "phoneNumber") {
    //         setErrors1({
    //             ...errors1,
    //             phoneNumber: phonePattern.test(value)
    //                 ? ""
    //                 : "Phone number must start with 6-9 and be 10 digits long",
    //         });
    //     }
    //     if (errors1.phoneNumber == '') { setIsMObileNumberVerified(false) }
    // }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues1({ ...values1, [name]: value });
    
        if (name === "phoneNumber") {
            const isValid = phonePattern.test(value);
            // console.log(isValid);
            setErrors1({
                ...errors1,
                // phoneNumber: isValid ? "" : "Phone number must start with 6-9 and be 10 digits long",
                phoneNumber: isValid ? "" : "phone number must start with a digit between 6-9 and must be exactly 10 digits",
            });

            if(!isValid){
                setResendTimer(0);
                setIsOtpSent(false);
        }
            // // Show OTP boxes only if the phone number is valid
            // setIsMObileNumberVerified(isValid);
        }
    };
    // console.log(errors1)

    const handleGenderChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value })
    }
    const handleInputChangeUserName = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value })

        if (name === "username") {
            // const isValid = usernamePattern.test(value);
            setErrors({
                ...errors,
                username: usernamePattern.test(value)
                    ? ""
                    // : "username A-Z a-z or, no space but one middle space is allowed in username",
                   : "Username can contain uppercase letters (A-Z) and lowercase letters (a-z), with no spaces except for one optional middle space",
            });
        }
    }

    const handleInputChangeEmail = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value })

        if (name === "email") {
            const isvalid = emailPattern.test(value);
            console.log(isvalid);
            setErrors({
                ...errors,
                email: emailPattern.test(value)
                    ? ""
                    // : "Enter Valid Email(all lower character and special character(abcd@gmail.com)",
                   : "Enter a valid email consisting of all lowercase letters and allowed special characters (e.g:abcd@gmail.com)",
            });
            if(!isvalid){
                setResendTimerEmail(0);
                setIsOtpSentEmail(false);
            }
        }
    }

    const handleInputChangePhoneNumber = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value })

        const isValid = phonePattern.test(value);
        console.log(isValid);
        
        if (name === "phoneNumber1") {
            setErrors({
                ...errors,
                phoneNumber1: phonePattern.test(value)
                    ? ""
                    // : "Phone number must start with 6-9 and be 10 digits long",
                    :"phone number must start 6-9 and must be exactly 10 digits",
            });
            if(!isValid){
                setResendTimerPhoneNumber(0);
                setIsOtpSentPhoneNumber(false);
            }
        }
    }
    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        if (value && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && otp[index] === "") {
            // Move focus to the previous input when Backspace is pressed on an empty field
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };
    
    const handleSendOtp = () => {
        if (!values1.phoneNumber || errors1.phoneNumber) {
            toast.error("Please enter a valid phone number.");

        }

        axios.get(`http://183.82.106.55:9100/register/get/${values1.phoneNumber}`)
            .then((res) => {
                console.log(res.data);

                if (res.data === "found") {
                    const date = new Date(); // Get the current date and time
                    const minutes = String(date.getMinutes()).padStart(2, '0'); // Pad minutes with leading zero
                    const seconds = String(date.getSeconds()).padStart(2, '0'); // Pad seconds with leading zero

                    const Otpxyz = minutes + seconds; // OTP generated using current minutes and seconds
                    setLoginOtp(Otpxyz); // Set the OTP in state
                    console.log(Otpxyz);
                    // Prepare the API endpoint and query parameters
                    const phoneNumber = values1.phoneNumber; // Assuming values.phoneNumber1 is defined
                    const message = `Dear customer, use this OTP ${Otpxyz} to signup into your Quality Thought Next account. This OTP will be valid for the next 15 mins.`;

                    // URL-encode the message
                    const encodedMessage = encodeURIComponent(message);

                    // API URL
                    const apiUrl = `https://login4.spearuc.com/MOBILE_APPS_API/sms_api.php?type=smsquicksend&user=qtnextotp&pass=987654&sender=QTTINF&t_id=1707170494921610008&to_mobileno=${phoneNumber}&sms_text=${encodedMessage}`;


                    // // Send OTP via API
                    axios.get(apiUrl)
                        .then((response) => {
                            // console.log("SMS API Response:", response.data);
                            // toast.info("OTP sent!");
                        })
                        .catch((error) => {
                            // console.error("SMS API Error:", error);
                            // toast.error("Failed to send OTP. Please try again.");
                        });
                    // toast.success("Successfully send OTP to the registered MobNo");
                    toast.success("OTP has been successfully sent to the registered mobile number");

                    // Update state for OTP input visibility and resend timer
                    setIsOtpSent(true);
                    setOtp(["", "", "", ""]); // Reset OTP input
                    setResendTimer(30); // Set 30-second resend timer
                    isClicked(false); // Hide "Send OTP" button
                } else {
                    // Phone number not found
                    toast.error("Phone number does not exist.");
                    setIsOtpSent(false);
                    setOtp(["", "", "", ""]); // Reset OTP input
                    setResendTimer(0); // Stop resend timer
                    isClicked(true); // Show "Send OTP" button
                }
            })
            .catch((error) => {
                console.error("API Error:", error);
                // toast.error("An error occurred while checking the phone number.");
                toast.error("An error occurred while verifying the phone number");

            });
    };

    const handleSendOtpEmail = () => {
        if (!values.email || errors.email) {
            toast.error("Please enter a valid Email Id.");
        } else {
            axios.get("http://183.82.106.55:9100/register/call/" + values.email).then((res) => {
                console.log(res.data);
                if (res.data == "data Was not found with the Email") {
                    axios.get("http://183.82.106.55:9100/register/send-otp?email=" + values.email).then((res) => {
                        console.log(res.data)
                        setServerEmailOtp(res.data);
                        toast.success("OTP sent your mail id")

                    })
                    setIsOtpSentEmail(true); // Show OTP boxes
                    isClickedEmail(false);
                    setOtpEmail(["", "", "", ""]);
                    setResendTimerEmail(30);
                    // toast.info("OTP sent!")

                } else {     
                    // toast.error("email is already exists")
                    toast.error("Email already exists")
                    setIsOtpSentEmail(false); // Show OTP boxes
                    isClickedEmail(true);
                    setOtpEmail(["", "", "", ""]);
                }
            })
        }
    };

    const handleSendOtpPhoneNumber = () => {
        if (!values.phoneNumber1 || errors.phoneNumber1) {
            toast.error("Please enter a valid phone number.");
        } else {
            axios.get("http://183.82.106.55:9100/register/get/" + values.phoneNumber1).then((res) => {
                console.log(res.data);
                if (res.data == "data Was not found with the MobileNo") {
                    const date = new Date(); // Get the current date and time
                    const minutes = String(date.getMinutes()).padStart(2, '0'); // Pad minutes with leading zero
                    const seconds = String(date.getSeconds()).padStart(2, '0'); // Pad seconds with leading zero

                    const Otpxyz = minutes + seconds; // OTP generated using current minutes and seconds
                    setServerMobileOtp(Otpxyz); // Set the OTP in state
                    console.log(Otpxyz);
                    // Prepare the API endpoint and query parameters
                    const phoneNumber = values.phoneNumber1; // Assuming values.phoneNumber1 is defined
                    const message = `Dear customer, use this OTP ${Otpxyz} to signup into your Quality Thought Next account. This OTP will be valid for the next 15 mins.`;

                    // URL-encode the message
                    const encodedMessage = encodeURIComponent(message);

                    // API URL
                    const apiUrl = `https://login4.spearuc.com/MOBILE_APPS_API/sms_api.php?type=smsquicksend&user=qtnextotp&pass=987654&sender=QTTINF&t_id=1707170494921610008&to_mobileno=${phoneNumber}&sms_text=${encodedMessage}`;

                    // Call the API
                    axios
                        .get(apiUrl)
                        .then((res) => {

                            // console.log('API Response:', res.data);
                        })
                        .catch((error) => {
                            // console.error('API Error:', error);
                        });

                    setIsOtpSentPhoneNumber(true); // Show OTP boxes
                    isClickedPhoneNumber(false);
                    setOtpPhoneNumber(["", "", "", ""])
                    setResendTimerPhoneNumber(30);
                    toast.success("OTP sent!");

                } else {
                    toast.error("phoneNumber already exists")
                    setIsOtpSentPhoneNumber(false); // Show OTP boxes
                    isClickedPhoneNumber(true);
                    setOtpPhoneNumber(["", "", "", ""])
                }

            })

        }
    };

    const handleOtpVerify = () => {
        const otpString = otp.join(""); // Combine the OTP digits into a single string
        if (otpString.length === 4) {

            console.log(otpString, logoinOtp)

            if (otpString == logoinOtp) {
                toast.success("OTP Verified!"); // Display a success message
                setIsOtpSent(false); // Hide the OTP input fields
                // console.log(resendTimer);
                setResendTimer(0);

                toast.success("Login successful!");
                //     setResendTimer(0); // Reset timer to allow sending OTP again
                closeModal(); // Close the modal
                setValues1("");
                Cookies.set("MobileNumber", values1.phoneNumber)
                navigate('/nav')
                toast.success("Login successful!");


            } else {
                toast.error("Invalid Otp")
                setIsOtpSent(true);

            }

        } else {
            toast.error("Please enter valid 4-digits OTP"); // Display an error message
        }
    };

    const handleOtpVerifyRegisterMobile = () => {
        const otpString = otpPhoneNumber.join(""); // Combine the OTP digits into a single string
        if (otpString.length === 4) {
            console.log(otpString, serverMobileOtp)

            if (otpString == serverMobileOtp) {
                toast.success("OTP Verified!");// Display a success message
                setIsMObileNumberVerified(true);
                setIsOtpSentPhoneNumber(false); // Hide the OTP input fields
                console.log(resendTimerPhoneNumber);
                setResendTimerPhoneNumber(0);
                console.log(resendTimerPhoneNumber);// Reset the timer to enable the "Send OTP" button
                // setOtpPhoneNumber(["", "", "", ""]); // Clear the OTP input
                console.log(resendTimerPhoneNumber);
                return true;
            } else {
                toast.error("Invalid Otp for MobileNumber")
                setIsOtpSentPhoneNumber(true);
                return false;
            }
        } else {
            toast.error("Please enter valid 4-digits OTP.For Mobile Number"); // Display an error message
        }
    };
    const handleOtpVerifyRegisteremail = () => {
        const otpString = otpEmail.join(""); // Combine the OTP digits into a single string
        if (otpString.length === 4) {
            console.log(otpString, serverEmailOtp)

            if (otpString == serverEmailOtp) {
                toast.success("OTP Verified!");
                setIsOtpSentEmail(false); // Hide the OTP input fields
                console.log(resendTimerEmail);
                setResendTimerEmail(0);
                console.log(resendTimerEmail);// Reset the timer to enable the "Send OTP" button
                // setOtpEmail(["", "", "", ""]); // Clear the OTP input
                console.log(resendTimerEmail);
                return true;

            } else {
                toast.error("Invalid Otp for Email")
                setIsOtpSentEmail(true); // Hide the OTP input fields

                return false;
            }
        } else {
            toast.error("Please enter valid 4-digit OTP. For Email"); // Display an error message
        }
    };
    const handleLogin = (e) => {
        e.preventDefault();
        if (!values1.phoneNumber || errors1.phoneNumber) {
            toast.error("Please fix the phone number error."); // Display error if phone number is invalid
        } else {
            handleOtpVerify(); // Verify OTP

        }
    };
    const handleRegister = (e) => {
        console.log(JSON.stringify(values, null, 2))
        e.preventDefault();
        const { username, phoneNumber1, email } = values;
        if (!username || !phoneNumber1 || !email || errors.username || errors.phoneNumber1 || errors.email) {
            toast.error("Please fill the form.");
        } else {
            // Verify Email OTP
            const isEmailValid = handleOtpVerifyRegisteremail();
            // Verify Mobile OTP
            const isMobileValid = handleOtpVerifyRegisterMobile();

            if (isEmailValid && isMobileValid) {
                toast.success("User Registered successfully!");

                setIsLogin(true); // Navigate to login form
                setValues("");

                setOtpEmail(["", "", "", ""]);
                setOtpPhoneNumber(["", "", "", ""]);

                const data = {
                    "fullName": values.username,
                    "mobileNo": values.phoneNumber1,
                    "email": values.email,
                    "gender": values.gender
                }
                const headers = {
                    "Content-Type": "application/json", // Specify content type
                    // Authorization: "Bearer your-token-here", // Example for a token
                    // "Custom-Header": "CustomValue", // Custom header example
                };
                console.log(JSON.stringify(data, null, 2))
                e.preventDefault();
                axios.post(
                    "http://183.82.106.55:9100/register/data", // API endpoint
                    data, // Request body
                    { headers } // Headers object
                ).then((res) => { console.log(res.data) })
                console.log(response)
                toast.success("User Registered successfully!");
            }
        }
    };
    const handleOtpChange1 = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return;

        const updatedOtpEmail = [...otpEmail];
        updatedOtpEmail[index] = value;
        setOtpEmail(updatedOtpEmail);

        if (value && index < otpEmail.length - 1) {
            document.getElementById(`otpEmail-input-${index + 1}`).focus();
        }
    };
    const handleKeyDown1 = (e, index) => {
        if (e.key === "Backspace" && otpEmail[index] === "") {
            // Move focus to the previous input when Backspace is pressed on an empty field
            const prevInput = document.getElementById(`otpEmail-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };
    const handleOtpChange2 = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return;

        const updatedOtpPhoneNumber = [...otpPhoneNumber];
        updatedOtpPhoneNumber[index] = value;
        setOtpPhoneNumber(updatedOtpPhoneNumber);

        if (value && index < otpPhoneNumber.length - 1) {
            document.getElementById(`otpPhoneNumber-input-${index + 1}`).focus();
        }
    };
    const handleKeyDown2 = (e, index) => {
        if (e.key === "Backspace" && otpPhoneNumber[index] === "") {
            // Move focus to the previous input when Backspace is pressed on an empty field
            const prevInput = document.getElementById(`otpPhoneNumber-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <div className="ms-3">
                    <img src={p1} className="rounded-1" alt="Logo" width="200px" height="50px" />
                </div>
                <div>
                    <button className="btn btn-success mx-4" onClick={openModal}>
                        Login
                    </button>
                </div>
            </nav>

            <Modal show={showModal}   backdrop="static" 
  keyboard={false} onHide={closeModal} centered>
                <Modal.Body className="p-4">
                    <button
                        type="button"
                        className="btn-close position-absolute top-0 end-0 m-3"
                        aria-label="Close"
                        onClick={closeModal}
                    ></button>
                    <h1 className="text-center">{isLogin ? "Login" : "Register"}</h1>

                    {isLogin ? (
                        <div>
                            <div className="mt-4">
                                <label htmlFor="phoneNumber" className="form-label">
                                    Phone Number
                                </label>
                                <div className="d-flex">
                                    <input
                                        style={{ width: "70%" }}
                                        type="text"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        maxLength="10"
                                        className={`form-control ${errors1.phoneNumber
                                            ? "is-invalid" : ""}`}
                                        placeholder="ex:88888888888"
                                        value={values1.phoneNumber}
                                        onChange={handleInputChange}
                                    />

                                    <div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSendOtp}
                                            className="mt-1 ms-3"
                                            
                                            // disabled={resendTimer > 0} // Button becomes active when resendTimer is 0
                                            // disabled={
                                            //     !!errors1.phoneNumber ||
                                            //     resendTimer > 0 // Button is disabled during the resend timer countdown
                                            // }

                                            // disabled={(errors1.phoneNumber || resendTimer > 0 )  ? values1.phoneNumber ? true:false :true }
                                            //   disabled={(values1.phoneNumber || resendTimer > 0 )  ? errors1.phoneNumber ? true:false :true }

                                            disabled={!(values1.phoneNumber && resendTimer == 0 && !errors1.phoneNumber)}
                                       >
                                            {resendTimer > 0
                                                ? `Resend OTP in ${resendTimer}s`
                                                : isOtpSent
                                                    ? "ReSend OTP"
                                                    : "Send OTP"}
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    {errors1.phoneNumber && (
                                        <small className="text-danger">{errors1.phoneNumber}</small>
                                    )}

                                </div>
                            </div>

                            {isOtpSent && (
                                <div className="mt-4 text-center">
                                    <Box display="flex" justifyContent="center" gap={1}>
                                        {otp.map((digit, index) => (
                                            <TextField
                                                key={index}
                                                id={`otp-input-${index}`}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(e, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}

                                                inputProps={{
                                                    maxLength: 1,
                                                    style: { textAlign: "center", width: "40px" },
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </div>
                            )}
                            <div className="text-center mt-4">
                                <button className="btn btn-success" onClick={handleLogin}>
                                    Login
                                </button>
                            </div>
                            <div style={{ marginLeft: "100px" }}>
                                <p className="mt-3">
                                    Don't have an account?{" "}
                                    <span className="text-success"
                                        style={{ cursor: "pointer" }} onClick={() => setIsLogin(false)}
                                    >
                                        Register
                                    </span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <form onSubmit={handleRegister}>
                                <div className="mt-4">
                                    <label htmlFor="username" className="form-label">
                                        Full Name (As per Aadhaar Card)
                                    </label>

                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                        placeholder="Enter full name"
                                        value={values.username}
                                        onChange={handleInputChangeUserName}
                                        required
                                    />
                                    {errors.username && (
                                        <small className="text-danger">{errors.username}</small>
                                    )}
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <div className="d-flex">
                                        <input
                                            style={{ width: "70%" }}
                                            type="email"
                                            id="email"
                                            name="email"
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            placeholder="ex:abcd@gmail.com"
                                            value={values.email}
                                            onChange={handleInputChangeEmail}
                                            required
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSendOtpEmail}
                                            className="mt-1 ms-3"
                                            // disabled={resendTimerEmail > 0} // Disable button during countdown
                                            // disabled={(values.email || resendTimerEmail > 0 )  ? errors.email ? true:false :true }
                                            disabled={!(values.email && resendTimerEmail == 0 && !errors.email)}
                                        >
                                            {resendTimerEmail > 0
                                                ? `Resend OTP in ${resendTimerEmail}s`
                                                : isOtpSentEmail
                                                    ? "ReSend OTP"
                                                    : "Send OTP"}
                                        </Button>
                                    </div>
                                    {errors.email && (
                                        <small className="text-danger">{errors.email}</small>
                                    )}
                                </div>

                                {isOtpSentEmail && (
                                    <div className="mt-4 text-center">
                                        <Box display="flex" justifyContent="center" gap={1}>
                                            {otpEmail.map((digit, index) => (
                                                <TextField
                                                    key={index}
                                                    id={`otpEmail-input-${index}`}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange1(e, index)}
                                                    onKeyDown={(e) => handleKeyDown1(e, index)}
                                                    // onKeyPress={(event) => {
                                                    //     const char = event.key;
                                                    //     if (char >= "A" && char <= "Z") {
                                                    //       event.preventDefault(); // Block uppercase letters
                                                    //     }
                                                    //   }}

                                                    inputProps={{
                                                        maxLength: 1,
                                                        style: { textAlign: "center", width: "40px" },
                                                    }}
                                                />
                                            ))}
                                        </Box>

                                    </div>
                                )}
                                <div className="mt-3">
                                    <label htmlFor="phoneNumber" className="form-label">
                                        Phone Number
                                    </label>
                                    <div className="d-flex">
                                        <input
                                            style={{ width: "70%" }}
                                            type="text"
                                            id="phoneNumber1"
                                            name="phoneNumber1"
                                            maxLength="10"
                                            className={`form-control ${errors.phoneNumber1 ? "is-invalid" : ""}`}
                                            placeholder="ex:8888888888"
                                            value={values.phoneNumber1}
                                            onChange={handleInputChangePhoneNumber}
                                            required
                                        />

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSendOtpPhoneNumber}
                                            className="mt-1 ms-3"
                                            // disabled={resendTimerPhoneNumber > 0} // Disable button during countdown
                                            // disabled={(values.phoneNumber1 && resendTimerPhoneNumber == 0 )  ? errors.phoneNumber1 ? true:false :true }

                                            disabled={!(values.phoneNumber1 && resendTimerPhoneNumber == 0 && !errors.phoneNumber1)}
                                        >
                                            {resendTimerPhoneNumber > 0
                                                ? `Resend OTP in ${resendTimerPhoneNumber}s`
                                                : isOtpSentPhoneNumber
                                                    ? "ReSend OTP"
                                                    : "Send OTP"}
                                        </Button>

                                    </div>
                                    {errors.phoneNumber1 && (
                                        <small className="text-danger">{errors.phoneNumber1}</small>
                                    )}
                                </div>

                                {isOtpSentPhoneNumber && (
                                    <div className="mt-4 text-center">
                                        <Box display="flex" justifyContent="center" gap={1}>
                                            {otpPhoneNumber.map((digit, index) => (
                                                <TextField
                                                    key={index}
                                                    id={`otpPhoneNumber-input-${index}`}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange2(e, index)}
                                                    onKeyDown={(e) => handleKeyDown2(e, index)}

                                                    inputProps={{
                                                        maxLength: 1,
                                                        style: { textAlign: "center", width: "40px" },
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </div>
                                )}
                                {/* </div> */}
                                <div className="mt-3">
                                    <label>Gender</label><br></br>
                                    <div className="d-flex">
                                        <input type="radio" name="gender" value="male" onChange={handleGenderChange} required /><label>Male</label><br />
                                        <div style={{ marginLeft: "20px" }}>

                                            <input type="radio" name="gender" value="female" onChange={handleGenderChange} required /><label>Female</label><br></br>
                                        </div>

                                    </div>
                                </div>

                                <div className="text-center mt-4">
                                    <button className="btn btn-success" >
                                        Register
                                    </button>
                                </div>
                                <div style={{ marginLeft: "100px" }}>
                                    <p className="mt-3">
                                        Already Have an account?{" "}
                                        <span
                                            className="text-success"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setIsLogin(true)}
                                        >
                                            Login
                                        </span>
                                    </p>
                                </div>
                            </form>
                        </div>
                    )}

                </Modal.Body>
            </Modal>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
export default Header;







