import styled from 'styled-components';
import PropTypes from 'prop-types';

const Button = ({ text = "Login", onClick, className }) => {
  return (
    <StyledWrapper>
      <button 
        type="button" 
        className={className || 'button'}
        onClick={onClick}
      >
        {text}
      </button>
    </StyledWrapper>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
};

const StyledWrapper = styled.div`
  .button {
    padding: 10px 20px;
    background: linear-gradient(135deg, #ffab00 0%, #ff9100 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 171, 0, 0.3);
  }

  .button:active {
    transform: translateY(1px);
  }
`;

export default Button;
