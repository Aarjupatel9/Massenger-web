import React, { useState , useContext } from 'react'
import PropTypes from 'prop-types'
import Subject from './Subject'
import UserContext from './UserContext'

const ComDep = props => {
  const user = useContext(UserContext);
  return (
    <div>
          <h3>{user} is work on com. dep.</h3>
          <Subject /> 
    </div>
  )
}


export default ComDep
