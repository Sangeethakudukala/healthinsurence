import React from "react";
import Homepage from "../uicomponents/homepage/Homepage";
import { Route, Routes } from "react-router-dom";
import Profile from "../uicomponents/content/header/Profile";
import Family from "../uicomponents/content/nextpage/Family";
import Relation from "../uicomponents/content/age/Relation";
// import Quotation from "../uicomponents/content/qotation/Quotation"
import Quotationinfo from "../uicomponents/content/qotation/Quotationinfo";
import Review from "../uicomponents/content/policyreview/Review";
import MyAccount from "../uicomponents/content/myprofile/MyAccount";
import MyPolicies from "../uicomponents/content/myprofile/MyPolicies";

function Routing(){
  return(
  <div>
    
    {/* <Homepage/> */}
    <Routes>
    <Route path='/' element={<Homepage/>}/>
    <Route  path='/nav' element={<Profile/>}/>
    <Route path="/next-page" element={<Family />} />
    <Route path="/page" element={<Relation/>} />
    {/* <Route path="/you" element={<Quotation/>} /> */}
    <Route path="/you" element={<Quotationinfo />} />
    <Route path="/review" element={<Review />} />
    <Route path="/my-account" element={<MyAccount />} />
    <Route path="/my-policies" element={<MyPolicies />} />
    
    </Routes>
  </div>
  )
}
export default Routing;




