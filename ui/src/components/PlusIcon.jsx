import React from 'react';
import PropTypes from 'prop-types';


const PlusIcon = ({height, width, onClick}) => {
  return <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8-2h2v-4h4v-2h-4V7h-2v4H7v2h4z"/></svg>
}

PlusIcon.propTypes = {
  onClick: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string,
}

export default PlusIcon;