import React from "react";
function ImageOptimize(props) {
    return (
        <img
            alt={props.alt || "HDBank"}
            src={`${props.src}`}
            {...props}
        />
    )
}
ImageOptimize.propTypes = {

};

ImageOptimize.defaultProps = {

};

export default ImageOptimize;