contract ExampleContract {

  function test(uint32 lastNum) public payable returns(uint256 answer) {
    answer = lastNum + 12;
  }

}
