import React, { useEffect, useRef, useState } from "react";
import "./under-process.scss";
import { showToastMessage } from "../shared/Toaster/Toaster";
import { ArchiveFileType, CaseStatus, ToastType } from "../Enum/Constants";
import axios from "axios";
import { BASE_URL } from "../../../config/Config";
import { formateDate } from "../shared/functions/global";
import { ToastContainer } from "react-toastify";
export const UnderProcess = () => {
  const [allCases, setAllCases] = useState([]);
  const inoviceNumber = useRef();
  const [bufferAllCases, setBufferAllCases] = useState([]);
  const [query, setQuery] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [currentCase, setCurrentCase] = useState();
  //    const handleAddInvoiceNumber = () =>{
  //       console.log({ inoviceNumber: inoviceNumber.current.value })
  //       showToastMessage("Invoice Number Added Successfuly",ToastType.Success)
  //   }
  useEffect(() => {
    const getAllCases = async () => {
      await axios
        .get(`${BASE_URL}/archive/${CaseStatus.IN_PROGRESS}`)
        .then(async (response) => {
          setAllCases(response.data);
          setBufferAllCases(response.data);
          //  console.log(allCases);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    getAllCases();
  }, [refresh]);
  const openPdfFile = (caseName, type) => {
    axios({
      url: `${BASE_URL}/archive/archive/${caseName.replace(
        / /g,
        "_"
      )}?type=${type}`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `new.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleInvoiceNumber = (item) => {
    let model = {
      invoiceNumber: inoviceNumber.current.value,
      acountingEmployee: "Husam",
    };
    axios
      .patch(`${BASE_URL}/archive/invoice/${item._id}`, model)
      .then((response) => {
        //   console.log(response.data);
        setRefresh((prev) => !prev);
        showToastMessage("Inovice Number Added Successfuly", ToastType.Success);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  };
  useEffect(() => {
    const filterCases = () => {
      if (query?.length > 2) {
        let bufferCases = allCases.filter((item) =>
          item.caseName.toLowerCase().includes(query.toLowerCase())
        );
        setAllCases(bufferCases);
      } else {
        setAllCases(bufferAllCases);
      }
    };
    filterCases();
  }, [query]);
  return (
    <>
      <ToastContainer />
      <div className="card">
        <div className="card-tittle">
          <h5>Cases under process </h5>
        </div>
        <div className="card-body">
          {allCases.length > 0 && (
            <div className="form-group">
              <input
                type="text"
                value={query}
                className="form-control"
                placeholder="Enter case name "
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}
          {allCases.length <= 0 && (
            <div className="empty-img">
              <img src="./images/Empty.png" alt="empty-img" />
              <strong>No Items Added Yet!</strong>
            </div>
          )}
          <div className="cases-grid">
            {allCases.map((item, index) => (
              <div className="case-grid">
                <div className="case-grid-tittle">
                  <h5>{item.caseName}</h5>
                  <span>{formateDate(item.caseDate)}</span>
                </div>
                <div className="files-cases">
                  <div className="file-case">
                    {item.files.findIndex(
                      (f) => f.type === ArchiveFileType.PKL
                    ) != -1 ? (
                      <i
                        class="fas fa-file-pdf"
                        onClick={() => {
                          openPdfFile(item.caseName, ArchiveFileType.PKL);
                        }}
                      ></i>
                    ) : (
                      <i class="far fa-file-pdf"></i>
                    )}
                    <strong>Packing List</strong>
                  </div>
                  {/* <div className="file-case">
                    {item.files.findIndex(
                      (f) => f.type === ArchiveFileType.BEOE
                    ) != -1 ? (
                      <i
                        class="fas fa-file-pdf"
                        onClick={() => {
                          openPdfFile(item.caseName, ArchiveFileType.BEOE);
                        }}
                      ></i>
                    ) : (
                      <i class="far fa-file-pdf"></i>
                    )}
                    <strong>Beo</strong>
                  </div>
                  <div className="file-case">
                    {item.files.findIndex(
                      (f) => f.type === ArchiveFileType.AS
                    ) != -1 ? (
                      <i
                        class="fas fa-file-pdf"
                        onClick={() => {
                          openPdfFile(item.caseName, ArchiveFileType.AS);
                        }}
                      ></i>
                    ) : (
                      <i class="far fa-file-pdf"></i>
                    )}
                    <strong>As</strong>
                  </div> */}
                </div>
                <div className="case-footer-view">
                  <h5>INV No</h5>
                  <span>
                    <input
                      type="text"
                      className="form-control"
                      ref={inoviceNumber}
                      placeholder="Enter invoice number "
                    />
                  </span>
                </div>
                <div
                  className="case-grid-footer"
                  onClick={() => {
                    handleInvoiceNumber(item);
                  }}
                >
                  <span>Done</span>
                </div>
              </div>
            ))}
            {/* <div className="case-grid">
          <div className="case-grid-tittle">
            <h5>6515616</h5>
            <span>5/10/2025</span>
          </div>
          <div className="files-cases">
             <div className="file-case">
                <i class="fas fa-file-pdf"></i>
                <strong>Packing List</strong>
             </div>
             <div className="file-case">
                <i class="far fa-file-pdf"></i>
                <strong>Beo</strong>
             </div>
             <div className="file-case">
                <i class="far fa-file-pdf"></i>
                <strong>As</strong>
             </div>
          </div>
          <div className="case-footer-view">
            <h5>INV No</h5>
            <span>
                <input type="text" className='form-control' placeholder='Enter invoice number ' />
            </span>
          </div>
          <div className="case-grid-footer">
             <span>Done</span>
           </div>
         </div>
         <div className="case-grid">
          <div className="case-grid-tittle">
            <h5>6515616</h5>
            <span>5/10/2025</span>
          </div>
          <div className="files-cases">
             <div className="file-case">
                <i class="fas fa-file-pdf"></i>
                <strong>Packing List</strong>
             </div>
             <div className="file-case">
                <i class="far fa-file-pdf"></i>
                <strong>Beo</strong>
             </div>
             <div className="file-case">
                <i class="far fa-file-pdf"></i>
                <strong>As</strong>
             </div>
          </div>
          <div className="case-footer-view">
            <h5>INV No</h5>
            <span>
                <input type="text" className='form-control' placeholder='Enter invoice number ' />
            </span>
          </div>
          <div className="case-grid-footer">
             <span>Done</span>
           </div>
         </div>
         <div className="case-grid">
          <div className="case-grid-tittle">
            <h5>6515616</h5>
            <span>5/10/2025</span>
          </div>
          <div className="files-cases">
             <div className="file-case">
                <i class="fas fa-file-pdf"></i>
                <strong>Packing List</strong>
             </div>
             <div className="file-case">
                <i class="far fa-file-pdf"></i>
                <strong>Beo</strong>
             </div>
             <div className="file-case">
                <i class="far fa-file-pdf"></i>
                <strong>As</strong>
             </div>
          </div>
          <div className="case-footer-view">
            <h5>INV No</h5>
            <span>
                <input type="text" className='form-control' placeholder='Enter invoice number ' />
            </span>
          </div>
          <div className="case-grid-footer">
             <span>Done</span>
           </div>
         </div>
         <div className="case-grid">
          <div className="case-grid-tittle">
            <h5>6515616</h5>
            <span>5/10/2025</span>
          </div>
          <div className="files-cases">
             <div className="file-case">
                <i class="fas fa-file-pdf"></i>
                <strong>Packing List</strong>
             </div>
             <div className="file-case">
                <i class="far fa-file-pdf"></i>
                <strong>Beo</strong>
             </div>
             <div className="file-case">
                <i class="far fa-file-pdf"></i>
                <strong>As</strong>
             </div>
          </div>
          <div className="case-footer-view">
            <h5>INV No</h5>
            <span>
                <input type="text" className='form-control' placeholder='Enter invoice number ' />
            </span>
          </div>
          <div className="case-grid-footer">
             <span>Done</span>
           </div>
         </div>
         <div className="case-grid">
          <div className="case-grid-tittle">
            <h5>6515616</h5>
            <span>5/10/2025</span>
          </div>
          <div className="files-cases">
             <div className="file-case">
                <i class="fas fa-file-pdf"></i>
                <strong>Packing List</strong>
             </div>
             <div className="file-case">
                <i class="far fa-file-pdf"></i>
                <strong>Beo</strong>
             </div>
             <div className="file-case">
                <i class="far fa-file-pdf"></i>
                <strong>As</strong>
             </div>
          </div>
          <div className="case-footer-view">
            <h5>INV No</h5>
            <span>
                <input type="text" className='form-control' placeholder='Enter invoice number ' />
            </span>
          </div>
          <div className="case-grid-footer">
             <span>Done</span>
           </div>
         </div> */}
          </div>
        </div>
      </div>
    </>
  );
};
