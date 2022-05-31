import React from 'react'

const CardContainer = (WrappedComponent) => {

    return(props){
        return (
            <>{WrappedComponent {...props}}</>
            )
        }
}

export default CardContainer