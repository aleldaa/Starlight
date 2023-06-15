import FriendsList from "./FriendsList";
import { useState } from "react";

function Friends({ friends }) {
  const [searchQuery, setSearchQuery] = useState("");

  function handleChange(e) {
    setSearchQuery(e.target.value);
  }

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const friendsList = filteredFriends.map((friend) => (
    <FriendsList key={friend.id} friend={friend} />
  ));

  return (
    <div>
      <form className="searchbar">
        <input
          type="text"
          id="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleChange}
        />
      </form>
      <div className="friends-list-wrap">
        <div className="friends-list">{friendsList}</div>
      </div>
    </div>
  );
}

export default Friends;