import React, { useState } from 'react';
import emojiList from 'emoji-datasource';

const EmojiPicker = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmojis, setFilteredEmojis] = useState(emojiList);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredEmojis = emojiList.filter((emoji) => {
      return (
        emoji.short_name.includes(searchTerm) ||
        emoji.keywords.includes(searchTerm)
      );
    });
    setSearchTerm(searchTerm);
    setFilteredEmojis(filteredEmojis);
  };

  const handleEmojiClick = (emoji) => {
    onSelect(emoji);
  };

  const renderEmojis = () => {
    return filteredEmojis.map((emoji, index) => (
      <span key={index} onClick={() => handleEmojiClick(emoji)}>
        {String.fromCodePoint(`0x${emoji.unified}`)}
      </span>
    ));
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        placeholder="Search for an emoji"
        onChange={handleSearchChange}
      />
      <div>{renderEmojis()}</div>
    </div>
  );
};

export default EmojiPicker;
