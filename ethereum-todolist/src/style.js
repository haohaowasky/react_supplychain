import styled, { injectGlobal } from 'styled-components';


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4em;
  background: #071D40;
`;

export const Dropdown = styled.select`
  width: 200px;
  margin: 0;
  padding: 0;
  line-height: 5;
  list-style: none;
  `;


export const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const H1 = styled.h1`
  color: #EEEEEE;
  font-size: 70px;
  margin-bottom: -20px;
`;

export const H2 = styled.h2`
  color: #EEEEEE;
  font-size: 30px;
`;

export const H3 = styled.h2`
  color: #EEEEEE;
  font-size: 20px;
`;

export const TodoListContainer = styled.section`
  background: #fff;
  position: relative;
  box-shadow: 0 2px 44px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
`;

export const InputText = styled.input`
  padding: 16px 16px 16px 60px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
  width: 540px;

  position: relative;
  margin: 0;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;

  &:focus {
    outline: none;
  }
`;


export const InputAccount = styled.input`
  padding: 16px 16px 16px 60px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0,0,0,0.03);
  width: 100px;

  position: relative;
  margin: 0;
  font-size: 15px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  color: #FEFEFE;

  &:focus {
    outline: none;
  }
`;


export const List = styled.ul`
  width: 540px;
  margin: 1;
  padding: 0;
  list-style: none;
`;

export const TodoItem = styled.li`
  position: relative;
  font-size: 22px;
  border-bottom: 1px solid #ededed;

  &:last-child {
    border-bottom: none;
  }
`;

export const ItemLabel = styled.label`
  white-space: pre-line;
  word-break: break-all;
  padding: 15px 60px 15px 15px;
  margin-left: 45px;
  display: block;
  line-height: 1.2;
  transition: color 0.4s;
`;

export const Button = styled.button`
  margin: 0;
  padding: 0;
  border: 1;
  background: white;
  font-size: 90%;
  vertical-align: baseline;
  font-family: inherit;
  font-weight: inherit;
  color: cc9a9a;
  appearance: none;
  font-smoothing: antialiased;
  outline: none;
`;

export const DestroyBtn = styled(Button)`
  position: absolute;
  top: 0;
  right: -50px;
  bottom: 0;
  width: 40px;
  height: 40px;
  margin: auto 0;
  font-size: 30px;
  color: #D97193;
  margin-bottom: 11px;
  transition: color 0.2s ease-out;
  cursor: pointer;
`;

export const AccButon = styled(Button)`
  position: absolute;
  top: 0;
  right: -120px;
  bottom: 1;
  width: 90px;
  height: -50px;
  margin: auto 0;
  font-size: 20px;
  color: #D97193;
  margin-bottom: 11px;
  transition: color 0.2s ease-out;
  cursor: pointer;
`;

export const PendingContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
`;

export const AccountContainer = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
`;

export const Pending = styled.div`
  color: ${props => props.active ? props.activeColor || 'red' : '#c7c7c7'};
`;




injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Roboto+Mono&subset=cyrillic');

  body {
    background-color: whitesmoke;
    font-family: 'Roboto', sans-serif;
  }
`
