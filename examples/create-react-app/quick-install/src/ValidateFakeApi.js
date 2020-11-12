/*
 * Copyright 2020 American Express Travel Related Services Company, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
 
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
          Oops. Please visit <a target="_blank" href={sandboxUrl}>{sandboxUrl}</a> to start the
          fake books api for this example. Click <button onClick={() => setIsUp(true)}>Reload</button> when
          done.
        </h3>
      )}
    </>
  );
};
