import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddShow() {
    setShowAdd((showAdd) => !showAdd);
  }
  const [friends, setFriends] = useState(initialFriends);

  function handAddFriend(freind) {
    setFriends((friends) => [...friends, freind]);
    console.log(friends);
  }
  function handleSelection(freind) {
    setSelectedFriend((curr) => (curr?.id === freind.id ? null : freind));
    setShowAdd(false);
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        ></FriendsList>
        {showAdd && <FormAddFriend onAddFriend={handAddFriend}></FormAddFriend>}
        <br />
        <Button onClick={handleAddShow}>
          {showAdd ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <AddSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((f) => (
        <Friend
          freind={f}
          key={f.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        ></Friend>
      ))}
    </ul>
  );
}

function Friend({ freind, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === freind.id;

  return (
    <div>
      <li className={isSelected ? "selected" : ""}>
        <img src={freind.image} alt={freind.name}></img>
        <h3>{freind.name}</h3>
        {freind.balance < 0 && (
          <p className="red">
            you owe {freind.name} ${Math.abs(freind.balance)}
          </p>
        )}
        {freind.balance > 0 && (
          <p className="green">
            {freind.name} owes you ${Math.abs(freind.balance)}
          </p>
        )}
        {freind.balance === 0 && <p>you and {freind.name} are even</p>}
        <Button onClick={() => onSelection(freind)}>
          {isSelected ? "Close" : "Select"}
        </Button>
      </li>
    </div>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID();

    if (!name || !image) return;
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-freind" onSubmit={handleSubmit}>
      <label>👯 Friend name </label>{" "}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>🌅 Image Url </label>{" "}
      <input
        type=""
        placeholder="https://"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}
function AddSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByuser, setPaidByUser] = useState("");
  const [whoIsPay, setWhoIsPay] = useState("user");
  const paidByFriend = bill ? bill - paidByuser : "";
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByuser) return;
    onSplitBill(whoIsPay === "user" ? paidByFriend : -paidByuser);
  }

  return (
    <div>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2> SPLIT A BILL WITH {selectedFriend.name}</h2>
        <label>💵 Bill Value</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        ></input>
        <label>🧍‍♀️ Your expense</label>
        <input
          type="text"
          value={paidByuser}
          onChange={(e) =>
            setPaidByUser(
              Number(e.target.value) > bill
                ? paidByuser
                : Number(e.target.value)
            )
          }
        ></input>
        <label>👭 {selectedFriend.name} expense: </label>
        <input type="text" disabled value={paidByFriend}></input>
        <label>🤑 Who is paying the bill? </label>
        <select value={whoIsPay} onChange={(e) => setWhoIsPay(e.target.value)}>
          <option value="user">You</option>
          <option value="friend">{selectedFriend.name}</option>
        </select>
        <Button>Split Bill</Button>
      </form>
    </div>
  );
}
