pragma solidity ^0.4.2;

contract TodoList {
  TodoItem[] todoItems;

  event ItemCheckedin(address owner, uint time);
  event ItemCheckedout(address owner, uint time);

  mapping (address => TodoItem[]) public Items;
  mapping (bytes32 => address[]) public Record;

  struct TodoItem {
    bytes32 value;
    bool active;
  }


  function addTodoItem(bytes32 _value) returns (bool success) {
    address merchant = msg.sender;

    TodoItem memory todoItem;
    todoItem.value = _value;
    todoItem.active = true;

    Items[msg.sender].push(todoItem);  // see this guy has how many items
    Record[_value].push(merchant);  // push merchant into array

    ItemCheckedin( msg.sender, now);
    return true;
  }

  function getTodoItems() constant returns (bytes32[], bool[]) {

    uint length = Items[msg.sender].length;

    bytes32[] memory values = new bytes32[](length); // to save space
    bool[] memory actives = new bool[](length);

    for (uint i = 0; i < length; i++) {
      values[i] = Items[msg.sender][i].value;
      actives[i] =  Items[msg.sender][i].active;
    }

    return (values, actives);
  }


  function getAdresses(bytes32 _itemNumber) constant returns (address[]) {
      return Record[_itemNumber];
  }


  function checkoutTodoItem(uint index) returns (bool success) {
    if (index >=  Items[msg.sender].length) return;
    Items[msg.sender][index].active = false;

    ItemCheckedout(msg.sender, now);
    return true;
  }
}
