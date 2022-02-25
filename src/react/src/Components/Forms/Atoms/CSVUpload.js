import React, { useState } from 'react';
import { useCSVReader } from 'react-papaparse';
import { Button } from 'react-bootstrap';


const CSVUpload = ({cleanData, checkData, saveData, text}) => {
    const { CSVReader } = useCSVReader();
    const [error, setError] = useState(null);

    return <CSVReader
        onUploadAccepted={({data}) => {
            const newData = cleanData(data);
            const errMessage = checkData(newData);
            setError(errMessage);
            if (errMessage == null) {
                saveData(newData);
            }
        }}
        config={{
            skipEmptyLines: true,
            transform: value => value.trim().toLowerCase(),
            dynamicTyping: true
        }}
    >
        {
            ({getRootProps}) => <React.Fragment>
                <Button {...getRootProps()}>
                    {text}
                </Button>
                <div>
                    {error}
                </div>
            
            </React.Fragment>
        }
    </CSVReader>;
};

export default CSVUpload;