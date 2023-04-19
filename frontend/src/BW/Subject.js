import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import UserContext from './UserContext'

const Subject = props => {
  const user = useContext(UserContext);
  return (
    <div>
          <h3>{user} will learn reacrt</h3>
    </div>
  )
}


export default Subject
