import React, { useState, useRef } from 'react';
import { CSVReader } from 'react-papaparse';
import { Button } from 'react-bootstrap';

const CSVUpload = ({ saveData, checkData, text }) => {
    const [error, setError] = useState(null)
    const buttonRef = useRef(null)

    const handleOpenDialog = (e) => {
        // Note that the ref is set async, so it might be null at some point 
        if (buttonRef.current) {
          buttonRef.current.open(e)
        }
      }

    const onFileLoad = (data) => {
        const newData = data.map(
            value => {
                if (value.data.length) {
                    return value.data
                }
            }
        )
        const errMessage = checkData(newData)
        setError(errMessage)
        if (errMessage == null) {
            saveData(newData)
        }
    }

    return <CSVReader
        onFileLoad={onFileLoad}
        noDrag
        noClick
        ref={buttonRef}
        config={{
            skipEmptyLines: true,
            transform: value => value.trim().toLowerCase(),
            dynamicTyping: true
        }}
    >
        {
            ({ file }) => {
                return <React.Fragment>
                    <Button onClick={handleOpenDialog}>
                        {text}
                    </Button>
                    <div>
                        {error}
                    </div>
                </React.Fragment>
            }
        }
    </CSVReader>
}

export default CSVUpload