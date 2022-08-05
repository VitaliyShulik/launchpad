import React, { useEffect, useState } from "react";

const textStyle = {
  overflowWrap: "anywhere",
};

const readOrHide = {
  color: "var(--primary)",
  cursor: "pointer",
};

const ReadMore = ({ children, max = 1000 }) => {
  const text = children.slice(0, max);
  const [newText, setNewText] = useState(
    text.split("\n").map((str, index) => (index <= 4 ? <p>{str}</p> : ""))
  );
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  useEffect(() => {
    if (!isReadMore) {
      setNewText(text.split("\n").map((str, index) => <p>{str}</p>));
    } else {
      setNewText(
        text.split("\n").map((str, index) => (index <= 4 ? <p>{str}</p> : ""))
      );
    }
  }, [isReadMore]);

  return (
    <p style={{ ...textStyle }} onClick={toggleReadMore}>
      {isReadMore ? newText.slice(0, 150) : newText}
      <span onClick={toggleReadMore} style={{ ...readOrHide }}>
        {isReadMore ? "...read more" : " show less"}
      </span>
    </p>
  );
};

export default ReadMore;
