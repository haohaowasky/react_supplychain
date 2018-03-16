import React, { Component } from 'react';
import SupplyChainContract from '../build/contracts/SupplyChain.json';
import web3, {
  selectContractInstance, mapReponseToJSON
} from './web3';
import {H3,Inner, InnerBox, InputAccount, AccountContainer,Container, Header, H1, H2, TodoListContainer, InputText, List,TodoItem,ItemLabel,DestroyBtn,PendingContainer,Pending} from './style.js';

class SupplyList extends Component {
  render() {
    return (

      <Container>
      <Header>
        <H1>Supplychain scanning portal</H1>
        <H2> scan your item </H2>
        <H3>
          {this.state.eventItemin.map((item, itmIndex) =>
            <TodoItem key={item.value}>
              <ItemLabel>{item}</ItemLabel>
            </TodoItem>
          )}
        </H3>

      </Header>
      <Inner>
        <TodoListContainer>
          <InputText
            value={this.state.newItem}
            placeholder="Scan your item"
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
                    onClick={() => this.scanoutItem(itmIndex)}
                  >
                 </DestroyBtn>
                </TodoItem>
              )}
            </List>
          }
        </TodoListContainer>
        <InnerBox>
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
          <H3> Select Account </H3>
        </AccountContainer>
        </InnerBox>
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
                  <ItemLabel>{itmIndex + 1} checked</ItemLabel>
                </TodoItem>
              )}
            </List>
          }
        </TodoListContainer>
        </Inner>
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
    this.scanoutItem = this.scanoutItem.bind(this);
    this.changeAccount = this.changeAccount.bind(this);
    this.readEvent = this.readEvent.bind(this);
  }

  async readEvent() {

    this.SupplyList = await selectContractInstance(SupplyChainContract); // json abiSupplyChain
    var events = this.SupplyList.ItemCheckedin({fromBlock: 0, toBlock: 'latest'});
    events.watch(function(error, result){
      const eventItemin = mapReponseToJSON(
        result, ['value', 'active'], 'arrayOfObject'
      );
      this.setSate({eventItemin});
    });
  }

  async componentWillMount() {
    this.SupplyList = await selectContractInstance(SupplyChainContract); // json abiSupplyChain
    const todoItems = await this.getItems();
    this.setState({ todoItems }); // set the initial value
  }


  async handleSubmit({ key }) {
    if (key !== 'Enter') return;
    this.setState({ pending: true });
    const SupplyList = await selectContractInstance(SupplyChainContract); // everytime it submits, it has the updates.
    await SupplyList.ScanItem(this.state.newItem, { from: web3.eth.accounts[this.state.accountNumber], gas:3000000});
    const todoItems = await this.getItems();
    this.setState({ todoItems, newItem: '', pending: false });
  }


  async searchSubmit({ key }) {
    if (key !== 'Enter') return;
    this.setState({ calling: true });
    const addressArray = await this.SupplyList.getAdresses(this.state.pastitem,{from: web3.eth.accounts[this.state.accountNumber], gas:3000000});
    this.setState({ addressArray, calling: false });
    return addressArray;

  }


  async changeAccount({ key }) {
    if (key !== 'Enter') return;
    this.setState({ pending: true });
    const todoItems = await this.getItems();
    this.setState({todoItems, pending: false });
  }


  async getItems() {
    this.setState({ calling: true });
    const todoItemsResp = await this.SupplyList.getItems({from: web3.eth.accounts[this.state.accountNumber]});
    const todoItems = mapReponseToJSON(
      todoItemsResp, ['value', 'active'], 'arrayOfObject'
    );
    this.setState({ calling: false });
    return todoItems;
  }


  async scanoutItem(position) {
    this.setState({ pending: true });
    await this.SupplyList.checkoutItem(position, {from: web3.eth.accounts[this.state.accountNumber]});
    const todoItems = await this.getItems();
    this.setState({ todoItems, pending: false });
  }
}



export default SupplyList;
