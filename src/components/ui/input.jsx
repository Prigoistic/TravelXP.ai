import styled from 'styled-components';
import PropTypes from 'prop-types';

const Input = ({ type, placeholder, onChange, value }) => {
  return (
    <StyledWrapper>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className="input"
      />
    </StyledWrapper>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string
};

const StyledWrapper = styled.div`
  .input {
    width: 350px;
    background-color: #f5f5f5;
    color: #000000;
    padding: 8px 16px;
    min-height: 40px;
    border-radius: 8px;
    outline: none;
    border: 1px solid #555;
    line-height: 1.5;
    font-size: 16px;
    text-align: center;
  }

  input:focus {
    border-bottom: 2px solid #5b5fc7;
    border-radius: 8px;
  }

  input:hover {
    outline: 1px solid lightgrey;
  }`;

export default Input;
