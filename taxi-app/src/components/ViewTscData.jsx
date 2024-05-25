import React from 'react'
import Header from './Header'
import { Link } from 'react-router-dom'
import html2pdf from 'html2pdf.js';
import './ViewTscData.css'

function ViewTscData() {

    var trip = null
    var i = null
    var extraHr = null

    document.addEventListener('DOMContentLoaded', function() {
        var extKM = 0;
        var totKM = parseFloat('{{  }}') || 0;
        var tripDays = parseInt('{{  }}') || 0;
        var mxKM = parseFloat('{{  }}') || 0;

        extKM = totKM - (tripDays * mxKM);
        console.log(extKM);

        var extraKMElement = document.querySelector('.extraKM');
        if (extKM > 0) {
            extraKMElement.textContent = extKM.toFixed(2);  // Using toFixed to limit decimal places
        } else {
            extraKMElement.textContent = 0;
        }
    });



    function printSheet(){
        document.getElementById("printTripSheet").style.display = 'block';
        var divToPrint=document.getElementById("printTripSheet");
        var printWindow = window.open('', '', 'height=700,width=1000');
        var styles = `
        .address{
            display: flex;
            flex-direction: column;
        }
        .address p,.footer p{
            font-size: 1rem;
            margin: 0;
        }
        .slip-container{
            width: 210mm;
            margin: 2rem auto;
            padding: 2rem;
        }
        .divider{
            margin: 1rem 0;
            border-bottom: 3px dotted black;
        }
        .trns-id p,.datetime p{
            font-size: 0.85rem;
            margin: 0;
        }
        .table-responsive {
            max-height:100vh;
        }
        .table-responsive::-webkit-scrollbar {
            display: none;
        }
  
        .equal-length-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
  
        .equal-length-item {
            flex: 1;
            text-align: center;
        }
        .equal-length-item hr{
          width: 60%;
          border-bottom: 1px solid black;
          position: relative;
          left: 20%;
        }
  
        .guide_places, .other_charges, .trip_split{
          font-size: 0.8rem;
        }
  
        .brand{
          font-family: "Agbalumo", system-ui;
        }
  
        `
        printWindow.document.write('<html><head><title></title>');
        printWindow.document.write(`
          <link href="{% static 'assets/vendor/bootstrap/css/bootstrap.min.css' %}" rel="stylesheet">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Agbalumo&family=Black+Ops+One&family=Gluten:wght@100..900&family=Playball&display=swap" rel="stylesheet">
        `);
        printWindow.document.write('</head>');
        printWindow.document.write('<body>');
        printWindow.document.write('<style>')
        printWindow.document.write(styles)
        printWindow.document.write('</style>')
  
        printWindow.document.write(divToPrint.outerHTML);
        printWindow.document.write('</body>');
        printWindow.document.write('</html>');
        printWindow.document.close();
        printWindow.print();
        // printWindow.addEventListener('afterprint', function() {
        //   printWindow.close();
        // });
        document.getElementById("printTripSheet").style.display = 'none';
      }
  
      
      function downloadPdf(){
        document.getElementById("printTripSheet").style.display = 'block';
        var tripNo = `{{ }}`;
        var element = document.getElementById('printTripSheet');
        var opt =
        {
            margin: 0,
            filename: 'TripSheet_'+ tripNo + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save().then(function(){
            document.getElementById("printTripSheet").style.display = 'none';
        });
      }
  return (
    <>
      <Header />
      <section className="vh-100 gradient-custom">
        <div className="container-fluid py-5">
            <div className="btns d-flex justify-content-end">
                <button className="btn btn-sm btn-secondary print" onClick={printSheet} id="templatePrintButton"><i className="fas fa-print me-1"></i> PRINT</button>
                <button className="btn btn-sm btn-secondary ms-1" onClick={downloadPdf} id="pdfButton"><i className="fas fa-file me-1"></i> PDF</button>
                <Link className="btn btn-sm btn-secondary ms-1" to="/all_trips">Close</Link>
            </div>
            <div className="row">
                <div className="trip_sheet" id="printTripSheet" style={{overflowX: "auto", display: "none"}}>
                <div className="slip-container bg-white" id="slip_container">
                    <div className="slip">
                        <div className="row sheet_header">
                        <div className="logo col-2 d-flex align-items-center">
                            <img src={`${process.env.PUBLIC_URL}/assets/images/logo_3.png`} style={{width: "100%"}} alt="Milayna CAB" />
                        </div>
                        <div className="company_head col-8">
                            <h5 className=" text-center brand">MILAYNA CAB</h5>
                            <div className="address text-center">
                                <p>Nechoor</p>
                                <p>Ernakulam - 686664</p>
                                <p>milaynacab@gmail.com</p>
                                <p>+91 80861 47845, +91 9400056444</p>
                            </div>
                        </div>
                        <div className="col-2 d-flex justify-content-center align-items-center">
                            <div className="qr">
                            <img src="" style={{width: "100px", maxWidth: "100%"}} alt="code" />
                            </div>
                        </div>
                        </div>
                        <hr />
                        {/* <div className="divider w-50"></div> */}
                        <h4 className="text-center">Trip Sheet for Contract Carriages</h4>
                        <hr style={{width: "50%", position: "relative", left: "25%"}} />
                        <div className="trip_details">
                            <div className="row">
                            <div className="col-3">
                                <h5>Trip No.</h5>
                            </div>
                            <div className="col-3">
                                {}
                            </div>

                            <div className="col-3">
                                <h5>Date</h5>
                            </div>
                            <div className="col-3">
                                {}
                            </div>
                            </div>

                            <div className="row">
                            <div className="col-3">
                                <p>Vehicle No.</p>
                            </div>
                            <div className="col-3">
                                {}
                            </div>

                            <div className="col-3">
                                <p>Driver Name</p>
                            </div>
                            <div className="col-3">
                                {}
                            </div>

                            </div>

                            <div className="row">
                            <div className="col-3">
                                <p>Guest Name</p>
                            </div>
                            <div className="col-3">
                                {}
                            </div>

                            <div className="col-3">
                                <p>Advance</p>
                            </div>
                            <div className="col-3">
                                <span>&#8377; </span>{}
                            </div>

                            </div>
                        </div>
                        <hr />
                        <div className="equal-length-container" style={{color: "black", fontWeight: "bold"}}>
                            <div className="equal-length-item" style={{textAlign: "center"}}>
                                Starting Place
                                <hr />
                            </div>
                            <div className="equal-length-item ml-2"  style={{textAlign: "center"}}>
                                Time
                                <hr />
                            </div>
                            <div className="equal-length-item"  style={{textAlign: "center"}}>
                                Destination
                                <hr />
                            </div>
                            <div className="equal-length-item"  style={{textAlign: "center"}}>
                                Time of Arrival
                                <hr />
                            </div>
                            <div className="equal-length-item"  style={{textAlign: "center"}}>
                                Kilometers
                                <hr />
                            </div>
                        </div>
                        <div className="equal-length-container" style={{color: "black", fontSize: "small", wordWrap: "break-word", marginBottom: "1vh"}}>
                            <div className="equal-length-item" style={{textAlign: "center"}}>
                                {}
                            </div>
                            <div className="equal-length-item" style={{textAlign: "center"}}>
                                {}
                            </div>
                            <div className="equal-length-item" style={{textAlign: "center"}}>
                                {}
                            </div>
                            <div className="equal-length-item" style={{textAlign: "center"}}>
                                {}
                            </div>
                            <div className="equal-length-item" style={{textAlign: "center"}}>
                                {}
                            </div>
                        </div>

        
                        <div className="px-4 subtot mt-5">
                            <div className="totDays mt-2">
                            <p className="mb-0">Starting KM: <span>{}</span></p>
                            <p className="mb-0">Ending KM: <span>{}</span></p>
                            </div>
                            <div className="totDays mt-1">
                                <p className="mb-0">Trip End date: <span>{}</span></p>
                                <p className="fw-bold">Total Days: <span>{}</span></p>
                            </div>
                            <div className="subtot-item d-flex justify-content-between">
                                <div>
                                    <span>Total Trip Charge</span>
                                </div>
                                <span><span>&#8377; </span>{}</span>
                            </div>
                            {/* { if  != 'Hour' } */}
                            {/* { if  != 0 } */}
                            <div className="trip_split w-100 mb-2">
                                <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                                <span>Fixed Charge(&#8377; {} per day upto {}KM)</span>
                                <span>&#8377; {}</span>
                                </span>
                                <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                                <span>Extra Running Charge(&#8377; {} extra charge per KM for <span className="extraKM"></span> KMs )</span>
                                <span>&#8377; {}</span>
                                </span>
                            </div>
                            {/* {% endif %} */}
                            {/* {% else %} */}
                            {/* {% if  != 0 %} */}
                            <div className="trip_split w-100 mb-2">
                                <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                                <span>Fixed Charge(&#8377; {} per day upto {}Hours)</span>
                                <span>&#8377; {}</span>
                                </span>
                                <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                                <span>Extra Hour Charge(&#8377; {} extra charge per Hour for <span className="extraHR">{extraHr}</span> Hrs )</span>
                                <span>&#8377; {}</span>
                                </span>
                            </div>
                            {/* {% endif %} */}
                            {/* {% endif %} */}
                            <div className="subtot-item d-flex justify-content-between">
                                <span>Permit</span>
                                <span><span>&#8377; </span>{}</span>
                            </div>
                            <div className="subtot-item d-flex justify-content-between">
                                <span>Entrance Fees</span>
                                <span><span>&#8377; </span>{}</span>
                            </div>
                            <div className="subtot-item d-flex justify-content-between">
                                <span>Parking</span>
                                <span><span>&#8377; </span>{}</span>
                            </div>
                            <div className="subtot-item d-flex justify-content-between">
                                <span>TOLL</span>
                                <span><span>&#8377; </span>{}</span>
                            </div>
                            <div className="subtot-item d-flex justify-content-between">
                                <span>Guide Fees</span>
                                <span><span>&#8377; </span>{}</span>
                            </div>
                            {/* {% if  != 0 %} */}
                            <div className="guide_places w-100">
                                {/* {% for i in guide_exp %} */}
                                <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                                <span>{}</span>
                                <span>&#8377; {}</span>
                                </span>
                                {/* {% endfor %} */}
                            </div>
                            {/* {% endif %} */}
                            <div className="subtot-item d-flex justify-content-between">
                                <span>Other Charges</span>
                                <span><span>&#8377; </span>{}</span>
                            </div>
                            {/* {% if  != 0 %} */}
                            <div className="other_charges w-100">
                                {/* {% for i in other_charges %} */}
                                <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                                <span>{}</span>
                                <span>&#8377; {}</span>
                                </span>
                                {/* {% endfor %} */}
                            </div>
                            {/* {% endif %} */}
                        </div>
                        <hr />
                        <div className="px-4">

                            <div className="debit fw-bold d-flex justify-content-between">
                                <span><strong>TOTAL</strong></span>
                                <span><strong><span>&#8377; </span>{}</strong></span>
                            </div>
                            <div className="balance fw-bold d-flex justify-content-between">
                            <span><strong>BALANCE</strong></span>
                            <span><strong><span>&#8377; </span>{}</strong></span>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="row mt-4 mb-5">
                            <div className="col-9">
                            <p>Remarks:</p>
                            </div>
                            <div className="col-3 d-flex justify-content-center">
                            <p>Signature</p>
                            </div>
                        </div>
                        <div className="footer mt-4 text-center">
                            <p>Thank you for choosing us.!</p>
                        </div>
                    </div>
                </div>
                </div>



                {/*  Bill Responsive -- w/o scroll for mobile view */}

                <div className="trip_sheet2" id="printTripSheetNoScroll">
                <div className="slip-container bg-white" id="slip_container">
                    <div className="slip">
                        <div className="row sheet_header">
                        <div className="logo col-2 d-flex align-items-center">
                            <img src={`${process.env.PUBLIC_URL}/assets/images/logo_3.png`} style={{width: "100%"}} alt="Milayna CAB" />
                        </div>
                        <div className="company_head col-8">
                            <h5 className=" text-center brand">MILAYNA CAB</h5>
                            <div className="address text-center">
                                <p>Nechoor</p>
                                <p>Ernakulam - 686664</p>
                                <p>milaynacab@gmail.com</p>
                                <p>+91 80861 47845, +91 9400056444</p>
                            </div>
                        </div>
                        <div className="col-2 d-flex justify-content-center align-items-center">
                            <div className="qr">
                            <img src="" style={{width: "100px", maxWidth: "100%"}} alt="code" />
                            </div>
                        </div>
                        </div>
                        <hr />
                        {/* <div className="divider w-50"></div> */}
                        <h4 className="text-center head2">Trip Sheet for Contract Carriages</h4>
                        <hr style={{width: "50%", position: "relative", left: "25%"}} />
                        <div className="trip_details">
                            <div className="row">
                            <div className="col-3">
                                <h5>Trip No.</h5>
                            </div>
                            <div className="col-3">
                                {}
                            </div>

                            <div className="col-3">
                                <h5>Date</h5>
                            </div>
                            <div className="col-3">
                                {}
                            </div>
                            </div>

                            <div className="row">
                            <div className="col-3">
                                <p>Vehicle No.</p>
                            </div>
                            <div className="col-3">
                                {}
                            </div>

                            <div className="col-3">
                                <p>Driver Name</p>
                            </div>
                            <div className="col-3">
                                {}
                            </div>

                            </div>

                            <div className="row">
                            <div className="col-3">
                                <p>Guest Name</p>
                            </div>
                            <div className="col-3">
                                {}
                            </div>

                            <div className="col-3">
                                <p>Advance</p>
                            </div>
                            <div className="col-3">
                                <span>&#8377; </span>{}
                            </div>

                            </div>
                        </div>
                        <hr />
                        <div className="equal-length-container" style={{color: "black", fontWeight: "bold"}}>
                            <div className="equal-length-item" style={{textAlign: "center"}}>
                                Starting Place
                                <hr />
                            </div>
                            <div className="equal-length-item"  style={{textAlign: "center"}}>
                                Time
                                <hr />
                            </div>
                            <div className="equal-length-item"  style={{textAlign: "center"}}>
                                Destination
                                <hr />
                            </div>
                            <div className="equal-length-item"  style={{textAlign: "center"}}>
                                Time of Arrival
                                <hr />
                            </div>
                            <div className="equal-length-item"  style={{textAlign: "center"}}>
                                Kilometers
                                <hr />
                            </div>
                        </div>
                        <div className="equal-length-container" style={{color: "black", fontSize: "small", wordWrap: "break-word", marginBottom: "1vh"}}>
                            <div className="equal-length-item" style={{textAlign: "center"}}>
                                {}
                            </div>
                            <div className="equal-length-item" style={{textAlign: "center"}}>
                                {}
                            </div>
                            <div className="equal-length-item" style={{textAlign: "center"}}>
                                {}
                            </div>
                            <div className="equal-length-item" style={{textAlign: "center"}}>
                                {}
                            </div>
                            <div className="equal-length-item" style={{textAlign: "center"}}>
                                {}
                            </div>
                            </div>
                            
                            <div className="px-4 subtot mt-5">
                            <div className="totDays mt-2">
                                <p className="mb-0">Starting KM: <span>{}</span></p>
                                <p className="mb-0">Ending KM: <span>{}</span></p>
                            </div>
                            <div className="totDays mt-1">
                                <p className="mb-0">Trip End date: <span>{}</span></p>
                                <p className="fw-bold">Total Days: <span>{}</span></p>
                            </div>
                            <div className="subtot-item d-flex justify-content-between">
                                <div>
                                    <span>Total Trip Charge</span>
                                    <br />
                                    {/* <span className="trip_breakdown">(&#8377; {} as fixed charge per day upto {{}}KM and &#8377; {{}} extra charge per KM)</span> */}
                                </div>
                                <span className="d-flex"><span>&#8377; </span>{}</span>
                            </div>
                            {/* {% if  != 'Hour' %} */}
                            {/* {% if  != 0 %} */}
                            <div className="trip_split w-100 mb-2">
                                <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                                <span>Fixed Charge(&#8377; {} per day upto {}KM)</span>
                                <span>&#8377; {}</span>
                                </span>
                                <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                                <span>Extra Running Charge(&#8377; {} extra charge per KM for <span className="extraKM"></span> KMs )</span>
                                <span>&#8377; {}</span>
                                </span>
                            </div>
                            {/* {% endif %} */}
                            {/* {% else %} */}
                            {/* {% if  != 0 %} */}
                            <div className="trip_split w-100 mb-2">
                                <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                                <span>Fixed Charge(&#8377; {} per day upto {}Hours)</span>
                                <span>&#8377; {}</span>
                                </span>
                                <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                                <span>Extra Hour Charge(&#8377; {} extra charge per Hour for <span className="extraHR">{extraHr}</span> Hrs )</span>
                                <span>&#8377; {}</span>
                                </span>
                            </div>
                            {/* {% endif %} */}
                            {/* {% endif %} */}
                            <div className="subtot-item d-flex justify-content-between">
                                <span>Permit</span>
                                <span><span>&#8377; </span>{}</span>
                            </div>
                            <div className="subtot-item d-flex justify-content-between">
                                <span>Entrance Fees</span>
                                <span><span>&#8377; </span>{}</span>
                            </div>
                            <div className="subtot-item d-flex justify-content-between">
                                <span>Parking</span>
                                <span><span>&#8377; </span>{}</span>
                            </div>
                            <div className="subtot-item d-flex justify-content-between">
                                <span>TOLL</span>
                                <span><span>&#8377; </span>{}</span>
                            </div>
                            <div className="subtot-item d-flex justify-content-between">
                                <div>
                                    <span>Guide Fees</span>
                                </div>
                                <span><span>&#8377; </span>{}</span>
                            </div>
                            {/* {% if  != 0 %} */}
                            <div className="guide_places w-100">
                                {/* {% for i in guide_exp %} */}
                                <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                                <span>{}</span>
                                <span>&#8377; {}</span>
                                </span>
                                {/* {% endfor %} */}
                            </div>
                            {/* {% endif %} */}
                            <div className="subtot-item d-flex justify-content-between">
                                <div>
                                <span>Other Charges</span>
                                </div>
                                <span><span>&#8377; </span>{}</span>
                            </div>
                            {/* {% if  != 0 %} */}
                            <div className="other_charges w-100">
                                {/* {% for i in other_charges %} */}
                                <span className="w-100 ps-3 pe-2 d-flex justify-content-between">
                                <span>{}</span>
                                <span>&#8377; {}</span>
                                </span>
                                {/* {% endfor %} */}
                            </div>
                            {/* {% endif %} */}
                        </div>
                        <hr />
                        <div className="px-4 grand_tot">

                            <div className="debit fw-bold d-flex justify-content-between">
                                <span><strong>TOTAL</strong></span>
                                <span><strong><span>&#8377; </span>{}</strong></span>
                            </div>
                            <div className="balance fw-bold d-flex justify-content-between">
                            <span><strong>BALANCE</strong></span>
                            <span><strong><span>&#8377; </span>{}</strong></span>
                            </div>
                        </div>
                        <div className="divider"></div>

                        <div className="row mt-4 mb-5">
                            <div className="col-9">
                            <p>Remarks:</p>
                            </div>
                            <div className="col-3 d-flex justify-content-center">
                            <p>Signature</p>
                            </div>
                        </div>

                        <div className="footer my-4 text-center">
                            <p>Thank you for choosing us.!</p>
                        </div>
                    </div>
                </div>
                </div>

            </div>
            </div>
        </section>
    </>
  )
}

export default ViewTscData
