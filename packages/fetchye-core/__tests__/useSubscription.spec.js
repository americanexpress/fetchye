/*
 * Copyright 2020 American Express Travel Related Services Company, Inc.
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
import { renderHook, act } from '@testing-library/react-hooks';
import useSubscription from '../src/useSubscription';

it('calls the subscriber', () => {
  const subscriber = jest.fn();
  const { result } = renderHook(() => useSubscription());
  const [notify, subscribe] = result.current;
  act(() => {
    subscribe(subscriber);
    notify();
  });
  expect(subscriber).toHaveBeenCalled();
});

it('does not call the subscriber', () => {
  const subscriber = jest.fn();
  const { result } = renderHook(() => useSubscription());
  const [notify, subscribe] = result.current;
  act(() => {
    const removeSubscriber = subscribe(subscriber);
    removeSubscriber();
    notify();
  });
  expect(subscriber).not.toHaveBeenCalled();
});
