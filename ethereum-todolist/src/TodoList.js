import React, { Component } from 'react';
import TodoListContract from '../build/contracts/TodoList.json';
import web3, {
  selectContractInstance, mapReponseToJSON
} from './web3';
import {H3,InputAccount, AccountContainer,Container, Header, H1, H2, TodoListContainer, InputText, List,TodoItem,ItemLabel,DestroyBtn,PendingContainer,Pending} from './style.js';

class TodoList extends Component {
  render() {
    return (
      <Container>
        <Header>
          <H1>Supplychain scaning portal</H1>
          <H2> scan yout item </H2>
          <H3>
            {this.state.eventItemin.map((item, itmIndex) =>
              <TodoItem key={item.value}>
                <ItemLabel>{item}</ItemLabel>
              </TodoItem>
            )}
          </H3>
        </Header>
        <TodoListContainer>
          <InputText
            value={this.state.newItem}
            placeholder="Input anything to put into blockchain"
            onChange={e => this.setState({ newItem: e.target.value })}
            onKeyDown={this.handleSubmit}
          />
          {this.state.todoItems.length > 0 &&
            <List>
              {this.state.todoItems.map((item, itmIndex) =>
                <TodoItem key={itmIndex}>
                  <ItemLabel>{item.value}</ItemLabel>
                  <ItemLabel>{item.active ? this.state.positive: this.state.negative}</ItemLabel>

                  <DestroyBtn
                    onClick={() => this.deleteTodoItem(itmIndex)}
                    X
                  >
                 </DestroyBtn>
                </TodoItem>
              )}
            </List>
          }
        </TodoListContainer>
        <PendingContainer>
          <Pending
            active={this.state.pending}
            activeColor="#5eef8b"
          >
            Pending Transaction
          </Pending>
          <Pending
            active={this.state.calling}
            activeColor="red"
          >
            Reading Blockchain
          </Pending>
        </PendingContainer>

        <AccountContainer>
          <InputAccount
            type= "number"
            value={this.state.accountNumber}
            placeholder="Input account index 0 to 10"
            onChange= {e => this.setState({ accountNumber: e.target.value })}
            onKeyDown={this.changeAccount}
          />
        </AccountContainer>

        <TodoListContainer>
          <InputText
            value={this.state.pastitem}
            placeholder="Search for item"
            onChange={e => this.setState({ pastitem: e.target.value })}
            onKeyDown={this.searchSubmit}
          />

          {this.state.addressArray.length > 0 &&
            <List>
              {this.state.addressArray.map((item, itmIndex) =>
                <TodoItem key={itmIndex}>
                  <ItemLabel>{item}</ItemLabel>
                  <ItemLabel>{itmIndex + 1} nd checked</ItemLabel>
                </TodoItem>
              )}
            </List>
          }
        </TodoListContainer>

      </Container>


    );
  }

  constructor(props) {
    super(props);

    this.state = {
      eventItemin: [],
      addressArray: [],
      pastitem: '',
      positive: 'in progress',
      negative: 'checked out',
      todoItems: [],
      newItem: '',
      accountNumber: 0,
      account: web3.eth.accounts[0],
      pending: false,
      calling: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.deleteTodoItem = this.deleteTodoItem.bind(this);
    this.changeAccount = this.changeAccount.bind(this);
    this.readEvent = this.readEvent.bind(this);
  }

  async readEvent() {

    this.todoList = await selectContractInstance(TodoListContract); // json abiSupplyChain
    var events = this.todoList.ItemCheckedin({fromBlock: 0, toBlock: 'latest'});
    events.watch(function(error, result){
      const eventItemin = mapReponseToJSON(
        result, ['value', 'active'], 'arrayOfObject'
      );
      this.setSate({eventItemin});
    });
  }

  async componentWillMount() {
    this.todoList = await selectContractInstance(TodoListContract); // json abiSupplyChain
    const todoItems = await this.getTodoItems();
    this.setState({ todoItems }); // set the initial value
  }


  async handleSubmit({ key }) {
    if (key !== 'Enter') return;
    this.setState({ pending: true });
    const todoList = await selectContractInstance(TodoListContract); // everytime it submits, it has the updates.
    await todoList.addTodoItem(this.state.newItem, { from: web3.eth.accounts[this.state.accountNumber], gas:3000000});

    // todoList is like calling the smartconract somehow
    // the addTodoItem in .sol takes 1 parameter,which is a byte32 value, along with the wallet address.
    const todoItems = await this.getTodoItems();

    // once added to the blockchain, updated the todoItems with getTodoItems.
    // the getTodoItems returns me array of bytes and array of bools
    // the getTodoitems is a functiont that has the ability to convert

    this.setState({ todoItems, newItem: '', pending: false });
  }


  async searchSubmit({ key }) {
    if (key !== 'Enter') return;
    this.setState({ calling: true });

    const addressArray = await this.todoList.getAdresses(this.state.pastitem,{from: web3.eth.accounts[this.state.accountNumber], gas:3000000});

    this.setState({ addressArray, calling: false });
    return addressArray;

  }


  async changeAccount({ key }) {
    if (key !== 'Enter') return;
    this.setState({ pending: true });

    const todoItems = await this.getTodoItems();

    this.setState({todoItems, pending: false });
  }


  async getTodoItems() {
    this.setState({ calling: true });

    const todoItemsResp = await this.todoList.getTodoItems({from: web3.eth.accounts[this.state.accountNumber]});
    const todoItems = mapReponseToJSON(
      todoItemsResp, ['value', 'active'], 'arrayOfObject'
    );

    this.setState({ calling: false });
    return todoItems;
  }

  async deleteTodoItem(position) {
    this.setState({ pending: true });
    await this.todoList.checkoutTodoItem(position, {from: web3.eth.accounts[this.state.accountNumber]});
    const todoItems = await this.getTodoItems();

    this.setState({ todoItems, pending: false });
  }
}



export default TodoList;
