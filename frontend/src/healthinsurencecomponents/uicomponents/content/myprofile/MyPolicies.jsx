
import React, { useEffect, useState } from "react";
import Nav from "../../nav/Nav";
import Footer from "../../nav/Footer";
import { Button, Card, CardContent, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

function MyPolicies() {
  const [policyData, setPolicyData] = useState([]); // Combined data for rendering
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);  // To store the data for the modal

  const [relationData, SetrelationData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

  const mobileNumber = sessionStorage.getItem('MobileNo');


  useEffect(async () => {
    try{
      const response = await axios.get(`http://183.82.106.55:9100/register/fetch/${mobileNumber}`);
      // console.log(response);
      if(response.status == 200){
        console.log(response.data)
        setPolicyData(response.data)
        relationDataObj(response.data.customerId);
      }
    }
    catch(error){
      console.log(error);
    }
  }, []);

  const relationDataObj=async(id)=>{
    try{
      const response = await axios.get(`http://183.82.106.55:9100/relation/customer-details?customerId=${id}`);
      console.log(response);
      if(response.status == 200){
        console.log(response.data)
        SetrelationData(response.data)
        paymentObject(id);
      }
    }
    catch(error){
      console.log(error);
    }
  }

  const paymentObject=async(id)=>{
    try{
      const response = await axios.get(`http://183.82.106.55:9100/payment/customerid?customerId=${id}`);   
      console.log(response);
      if(response.status == 200){
        console.log(response.data)
        setPaymentData(response.data)
      }
    }
    catch(error){
      console.log(error);
    }
  }
  
  const handleDownloadInvoice = (policyId) => {
    console.log(`Download invoice for Policy ID: ${policyId}`);
  };

  const handleOpenModal = (data) => {
    console.log(data);
    setModalData(data); // Store the full relation data for the selected policy
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  // console.log(policyData);
  console.log(paymentData);
  
  

  return (
    <div>
      <Nav />
      <div className="container mt-4">
        <Typography
          variant="h4"
          className="mb-4"
          style={{ fontWeight: "bold", textAlign: "center" }}
        >
          RamanaSoft - Purchased Policy Overview
        </Typography>
        {paymentData.length == 0 ? (
          <Typography variant="h6" color="textSecondary">
            No policies found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {paymentData.map((payment, index) => {
              // Filter relationData to find the matching relation by paymentId
              const relatedData = relationData.filter(
                (relation) => relation.paymentId === payment.paymentId
              );

              return relatedData.length > 0 ? (
                <Card key={index} className="mb-3">
                  <CardContent>
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "16px",
                        }}
                      >
                        <Typography variant="h6" style={{ fontWeight: "bold" }}>
                          RamanaSecure Health Insurance
                        </Typography>
                        <div
                          style={{
                            borderBottom: "1px solid lightgray",
                            paddingBottom: "4px",
                            marginBottom: "16px",
                          }}
                        >
                          <Typography variant="h6" style={{ fontWeight: "bold" }}>
                            CustomerID: {payment.customerId}
                          </Typography>
                        </div>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="h6">
                          Insurance Type: {payment.insuranceType || "N/A"}
                        </Typography>
                        <div className="field-spacing"></div>
                        <Typography variant="h6">
                          Sum Assured: {payment.sumAssuredAmount || "N/A"}
                        </Typography>
                        <div className="field-spacing"></div>
                        <Typography variant="h6">
                          Premium Amount: {payment.premiumAmount || "N/A"}
                        </Typography>
                        <div className="field-spacing"></div>
                        <Typography variant="h6">
                          Policy Holders Details:
                          <Link
                            onClick={() => handleOpenModal(relatedData)} // Pass full relation data
                            style={{ cursor: "pointer", color: "blue" }}
                          >
                            Click Here
                          </Link>
                        </Typography>
                        <div className="field-spacing"></div>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="h6">
                          Number of Years: {payment.year || "N/A"}
                        </Typography>
                        <div className="field-spacing"></div>
                        <Typography variant="h6">
                          Start Date: {payment.startDate || "N/A"}
                        </Typography>
                        <div className="field-spacing"></div>
                        <Typography variant="h6">
                          Renewal Date: {payment.endDate || "N/A"}
                        </Typography>
                        <div className="field-spacing"></div>

                        <a
                          className='btn btn-success'
                          href={`http://183.82.106.55:9100/invoice/create/${payment.paymentId}`}
                          download='invoice'
                          target='_blank'
                        >
                          <Button
                            color="white"
                            startIcon={<DownloadIcon />}
                          >
                            Invoice
                          </Button>
                        </a>

                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ) : null;
            })}
          </Grid>
        )}
      </div>

      {/* Modal to display insured members */}
      {/* <Dialog
        open={showModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle style={{ backgroundColor: "#4CAF50", color: "white", textAlign: "center" }}>
          Insured Members
        </DialogTitle>
        <DialogContent>
          {modalData ? (
            <div style={{ padding: "20px", backgroundColor: "#f4f4f4", borderRadius: "8px" }}>
              <Typography variant="body1" style={{ marginBottom: "10px", marginTop: "10px" }}>
                <strong>Member Details:</strong>
                {modalData.map((member, idx) => (
                  <div key={idx} style={{ marginBottom: "16px" }}>
                    <Typography variant="body1"><strong>Relation Name:</strong> {member.relationName}</Typography>
                    <Typography variant="body1"><strong>Relation Person Name:</strong> {member.relationPersonName}</Typography>
                    <Typography variant="body1"><strong>Age of Relation:</strong> {member.ageOfTheRelation}</Typography>
                    <Typography variant="body1"><strong>Disease:</strong> {member.disease}</Typography>
                    {/* Add more details as needed */}
                  {/* </div>
                ))}
              </Typography>
            </div>
          ) : (
            <Typography variant="body1" color="textSecondary">No data available.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} color="primary" variant="outlined" style={{ margin: "0 10px" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog> */} 
      <Dialog
  open={showModal}
  onClose={(_, reason) => {
    if (reason !== "backdropClick") {
      handleCloseModal();
    }
  }}
  maxWidth="md"
  fullWidth
>
  <DialogTitle
    style={{
      backgroundColor: "#4CAF50",
      color: "white",
      textAlign: "center",
      fontSize: "20px",
      fontWeight: "bold",
    }}
  >
    Insured Members
  </DialogTitle>
  <DialogContent>
    {modalData ? (
      <div style={{ padding: "20px", backgroundColor: "#f4f4f4", borderRadius: "8px" }}>
        <Grid container spacing={2}>
          {modalData.map((member, idx) => (
            <Grid item xs={6} key={idx}>
              <Card variant="outlined" style={{ padding: "15px", borderRadius: "10px", background: "#ffffff" }}>
                <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  Member {idx + 1}
                </Typography>
                <Typography variant="body1"><strong>Relation Name:</strong> {member.relationName}</Typography>
                <Typography variant="body1"><strong>Person Name:</strong> {member.relationPersonName}</Typography>
                <Typography variant="body1"><strong>Age:</strong> {member.ageOfTheRelation}</Typography>
                <Typography variant="body1"><strong>Disease:</strong> {member.disease || "N/A"}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    ) : (
      <Typography variant="body1" color="textSecondary">
        No data available.
      </Typography>
    )}
  </DialogContent>

  <DialogActions style={{ justifyContent: "center", paddingBottom: "15px" }}>
    <Button
      onClick={handleCloseModal}
      color="primary"
      variant="contained"
      style={{ padding: "8px 20px", fontWeight: "bold", backgroundColor: "#4CAF50" }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
      <Footer />
    </div>
  );
}

export default MyPolicies;
