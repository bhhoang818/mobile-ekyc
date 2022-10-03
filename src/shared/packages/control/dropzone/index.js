import React, { useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import PropTypes from "prop-types";
import { isEmpty } from "lodash"
import filters from "utils/filter";

const ERROR_CODE = {
    FILE_INVALID_TYPE: 'file-invalid-type',
    FILE_TOO_LARGE: 'file-too-large',
    TOO_MANY_FILES: 'too-many-files'
}

const MIME_TYPE = {
    IMAGE: 'image/*',
    PDF: 'application/pdf',
    WORD: 'application/msword',
    WORD_X: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    EXCEL: 'application/vnd.ms-excel',
    EXCEL_X: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ZIP: 'application/zip,application/x-zip-compressed,multipart/x-zip',
    ZIP_7z: 'application/x-7z-compressed',
    RAR: 'application/x-rar-compressed',
    OUTLOOK_EMAIL: '.msg'
}

const { forwardRef, useImperativeHandle } = React;

const Dropzone = forwardRef((props, ref) => {
    const [uploadedFile, setUploadedFile] = useState(props?.fileCurrentData);
    const [internalError, setInternalError] = useState(null);
    const isImage = (mimeType) => {
        return mimeType.split('/').includes('image')
    }
    useImperativeHandle(ref, () => ({
        resetUploadedFile() {
            setUploadedFile([]);
        }
    }));
    const {
        getRootProps,
        getInputProps,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: props.acceptedFiles,
        disabled: props.disabled,
        noDrag: props.noDrag,
        maxFiles: props.maxFiles,
        multiple: props.multiple,
        maxSize: props.maxSize,
        onDrop: (acceptedFiles) => {
            acceptedFiles.map(file => {
                if (isImage(file.type)) {
                    Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                    const finalFiles = props.multiple ? [...acceptedFiles, ...uploadedFile] : acceptedFiles

                    if (!isEmpty(finalFiles)) {
                        props.onDrop(finalFiles)
                        setUploadedFile(finalFiles);
                        setInternalError(null)
                    }
                }
                else {
                    setInternalError('uploadAttachment.errors.fileInvalidType')
                }
            })
        },
        onDropRejected: (fileRejections) => {
            if (!isEmpty(fileRejections)) {
                fileRejections.forEach(item => {
                    item.errors.forEach(error => {
                        switch (error.code) {
                            case ERROR_CODE.FILE_INVALID_TYPE: {
                                setInternalError('uploadAttachment.errors.fileInvalidType')
                                break
                            }
                            case ERROR_CODE.FILE_TOO_LARGE: {
                                setInternalError('uploadAttachment.errors.fileTooLarge', {
                                    size: props.maxSize / (1024 * 1024)
                                })
                                break
                            }
                            case ERROR_CODE.TOO_MANY_FILES: {
                                setInternalError('uploadAttachment.errors.tooManyFiles', {
                                    fileNumber: props.maxFiles
                                })
                                break
                            }
                            default: {
                                setInternalError(null)
                                break
                            }
                        }
                    })
                })
            }
        }
    });
    useEffect(() => {
        if (props.isError) {
            setInternalError('uploadAttachment.errors.fileEmpty')
        }
    }, [props.isError])

    const classNames = useMemo(() => (
        (isDragAccept ? 'border-success' : '') ||
        (isDragReject ? 'border-danger' : '') ||
        (props.isError ? 'border-danger is-invalid' : '') ||
        (internalError ? 'border-danger is-invalid' : '')
    ), [
        isDragReject,
        isDragAccept,
        props.isError,
        internalError
    ]);

    const createPreview = (type) => {
        switch (type) {
            case MIME_TYPE.PDF: {
                return <i className="fa fa-file-pdf-o fa-5x" aria-hidden="true"></i>
            }
            case MIME_TYPE.EXCEL_X:
            case MIME_TYPE.EXCEL: {
                return <i className="fa fa-file-excel-o fa-5x" aria-hidden="true"></i>
            }
            case MIME_TYPE.WORD_X:
            case MIME_TYPE.WORD: {
                return <i className="fa fa-file-word-o fa-5x" aria-hidden="true"></i>
            }
            default:
                return <i className="fa fa-file fa-5x" aria-hidden="true"></i>
        }
    }

    const removeUserFile = (index) => {
        // make a var for the new array
        const newFiles = [...uploadedFile];
        // remove the file from the array
        newFiles.splice(index, 1);
        // update the state
        setUploadedFile(newFiles);
        //refetch the dropfiles
        props.onDrop(newFiles);
        setInternalError(null);
    }

    const thumbs = (file) => {
        return <>
            {
                file.preview ? <img className="img-responsive" src={file.preview} /> :
                    <div>{createPreview(file.type)}</div>
            }
        </>
    };

    return (
        <>
            <div {...getRootProps()} className={`card-attachment position-relative has-icon-right ${classNames}`}>
                <input {...getInputProps()} />
                <div className="text-center align-content-center justify-content-center text-body">
                    <p className="mb-0">{props.message ? props.message : 'uploadAttachment.placeholder.dropItem'}</p>
                    <em>{props.acceptedFilesMessage}</em>
                </div>
                <p style={{ textAlign: 'center' }}>{internalError}</p>
                {/* <InvalidFeedBack message={internalError} /> */}
            </div>
            {
                props.hasThumb && <div className="row mt-1">
                    {
                        uploadedFile.map((file, index) => (
                            <div className="col-3" key={index}>
                                <div className="card-image">
                                    <button onClick={() => removeUserFile(index)} className="avatar" type="button">
                                        <em className="material-icons">delete</em>
                                    </button>
                                    {thumbs(file)}
                                    <div className="card-image-desc" key={file.path}>
                                        <h6 className="mb-0 text-truncate text-lowercase"
                                            title={file.path}>{file.path}</h6>
                                        <p className="mb-0"><small>{filters.number(file.size)} bytes</small></p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }

        </>
    );
})

Dropzone.propTypes = {
    message: PropTypes.string,
    acceptedFiles: PropTypes.string,
    acceptedFilesMessage: PropTypes.string,
    disabled: PropTypes.bool,
    noDrag: PropTypes.bool,
    multiple: PropTypes.bool,
    hasThumb: PropTypes.bool,
    isError: PropTypes.bool,
    maxFiles: PropTypes.number,
    onDrop: PropTypes.func,
    maxSize: PropTypes.number,
    fileCurrentData: PropTypes.array
};

Dropzone.defaultProps = {
    message: '',
    disabled: false,
    noDrag: false,
    maxFiles: 2,
    multiple: true,
    isError: false,
    hasThumb: true,
    fileCurrentData: [],
    maxSize: 10485760
};

export default Dropzone
