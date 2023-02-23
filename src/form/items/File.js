// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import styles from "../items.module.css"

import { handleProfileImage } from "src/public/hooks/handleProfileImage"
import useData from 'context/data'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import FileDocumentOutline from 'mdi-material-ui/FileDocumentOutline'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(15.75)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 160
  }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

const FileUploaderRestrictions = ({ title, items, index, id, data, handleData,text,isRequired  }) => {
  // ** State
  const [files, setFiles] = useState()
  const [fileListData,setFileListData] = useState([])


  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 8,
    maxSize: 20000000,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error('20MB이하의 파일을 최대 8개 업로드할 수 있습니다.', {
        duration: 2000
      })
    }
  })

  useEffect(() => {
    // console.log([...fileList, ...files])
    if (files !== undefined && fileListData.length<8) {
      setFileListData([...fileListData, ...files])
      controlData([...fileListData, ...files])
    }  
  }, [files])
  
  useEffect(() => {
    const index = valueIndex()
    if(index!==false)
      setFileListData([...data[index].value])
  }, [])
  
  const controlData = (targetValue) => {
    let prevData = data
    const value = valueIndex()
    if (value===false)
      prevData.push({id: id, value: targetValue, file:true})
    else 
      prevData[value]["value"] = targetValue
    
    handleData(prevData)
  }

  const valueIndex = () => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        return i
      }
    }
    return false
  }

  const renderFilePreview = file => {
    if (file.type === undefined) {
      return <FileDocumentOutline />
    }else if (file.type.startsWith('image')) {
      return <img width={32} height={32} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <FileDocumentOutline />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = fileListData
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFileListData([...filtered])
    controlData([...filtered])
  }

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

  const fileList = fileListData.map((file, index) => {
    return (
    <ListItem key={index}>
      <div className='file-details' style={{display: "flex", width:"100%"}}>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div style={{marginLeft:"10px"}}>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {/* {Math.round(file.size / 100) / 10 > 1000
              ? {(Math.round(file.size / 100) / 10000).toFixed(1)} mb
              : {(Math.round(file.size / 100) / 10).toFixed(1)} kb} */}
            {file.size!==undefined && formatBytes(file.size,1)}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Close fontSize='small' />
      </IconButton>
    </ListItem>    )
  })

  const handleRemoveAllFiles = () => {
    setFiles([])
  }
  
  const createMarkup = () => {
    return {__html: text}
  }

  return (
    <div className={styles.image_container} key={index}>
      <div className={styles.single_checkbox_container}>
        <h1>{title}<p>{isRequired && "*필수항목"}</p></h1>
          {
            text &&
            <div className="quill_custom_editor">
              <div dangerouslySetInnerHTML={createMarkup()} />
            </div>
          }
      </div>
      <div className={styles.title_container}>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Button >파일 업로드</Button>
        </div>
      </div>
      <p>20MB이하의 파일을 최대 8개 업로드할 수 있습니다.</p>
      {fileListData.length > 0 && <List>{fileList}</List>}
    </div>
  )
}

export default FileUploaderRestrictions
