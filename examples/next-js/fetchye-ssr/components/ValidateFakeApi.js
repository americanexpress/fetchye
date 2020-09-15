import React, { useEffect, useState } from "react";

export const ValidateFakeApi = ({ sandboxUrl, url, children }) => {
  const [isUp, setIsUp] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url);
        if (res.status === 200) {
          setIsUp(true);
        } else {
          setIsUp(false);
        }
      } catch (error) {
        setIsUp(false);
        console.error(error.message);
      }
    })();
  }, [setIsUp, url, isUp]);

  return (
    <>
      {isUp && children}
      {!isUp && (
        <h3>
          <span aria-label="light-bulb" role="img">
            💡
          </span>{" "}
          Oops. Please visit{" "}
          <a target="_blank" href={sandboxUrl}>
            {sandboxUrl}
          </a>{" "}
          to start the fake books api for this example. Click{" "}
          <button onClick={() => setIsUp(true)}>Reload</button> when done.
        </h3>
      )}
    </>
  );
};
