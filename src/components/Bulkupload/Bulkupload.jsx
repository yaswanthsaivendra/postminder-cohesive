import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";

const Bulkupload = () => {
  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  //State to store the values
  const [values, setValues] = useState([]);
  const [csv, setCsv] = useState({});

  // on drop fxn
  const onDrop = useCallback(
    (acceptedFiles) => {
      setCsv(acceptedFiles[0]);
      //read csv file
      Papa.parse(acceptedFiles[0], {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const rowsArray = [];
          const valuesArray = [];

          // Iterating data to get column name and their values
          results.data.map((d) => {
            rowsArray.push(Object.keys(d));
            valuesArray.push(Object.values(d));
          });

          // Parsed Data Response in array format
          setParsedData(results.data);

          // Filtered Column Names
          setTableRows(rowsArray[0]);

          // Filtered Values
          setValues(valuesArray);
        },
      });
     
         
  
    },
    [setCsv]
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <>
     <div className="flex justify-between">
     <h1 className="mb-4 text-2xl font-semibold text-gray-900 ">Bulk Upload</h1>
     {JSON.stringify(csv) === "{}" ?<></>:
     <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={console.log('hi')}>Schedule</button>}
     </div>

      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div
          class="flex flex-col items-center justify-center w-full h-90 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 mt-5"
          style={{ minHeight: "80vh" }}>
          <div
            class="flex flex-col items-center justify-center pt-5 pb-6 w-full p-3"
            id="imgPreview">
            {JSON.stringify(csv) === "{}" ? (
              <>
                <svg
                  aria-hidden="true"
                  class="w-20 h-20 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>

                <p class="mb-2 text-3xl  font-semibold text-gray-400 dark:text-gray-400">
                  Drag and drop a CSV
                </p>
                <p
                  class="text-xl text-gray-400 dark:text-gray-400"
                  style={{ textDecoration: "underline" }}>
                  or Browse a CSV file here
                </p>
              </>
            ) : (
              <>
            
                <table id="csvTable" className="w-full text-sm text-left text-gray-500 dark:text-gray-400" style={{width: '100%'}}>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      {tableRows.map((rows, index) => {
                        return <th className="px-6 py-3" key={index}>{rows}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {values.map((value, index) => {
                      return (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                          {value.map((val, i) => {
                            return <td
                            className="px-6 py-4" key={i}>{val}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
   
    </>
  );
};
export default Bulkupload;
