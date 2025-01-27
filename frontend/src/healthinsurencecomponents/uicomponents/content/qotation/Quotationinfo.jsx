import React from 'react'
import Quotation from './Quotation'
import Quotationfamily from './Quotationfamily'
import Cookies from 'js-cookie';

function Quotationinfo() {

    const insurencetype=Cookies.get('insuranceType');
    // const insurencetype ="Individual";

  return (
    // <div>Qutationinfo</div>
    <>
    {insurencetype =="Individual"?(<> <Quotation /> </>):(<> <Quotationfamily /> </>)}
    </>
  )
}

export default Quotationinfo;