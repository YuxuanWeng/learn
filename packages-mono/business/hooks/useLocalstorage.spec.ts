import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { act, renderHook } from '@testing-library/react';

describe('useLocalStorage()', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initial state is in the returned state', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'value'));

    expect(result.current[0]).toBe('value');
  });

  it('Initial state is a callback function', () => {
    const { result } = renderHook(() => useLocalStorage('key', () => 'value'));

    expect(result.current[0]).toBe('value');
  });

  it('Initial state is an array', () => {
    const { result } = renderHook(() => useLocalStorage('digits', [1, 2]));

    expect(result.current[0]).toEqual([1, 2]);
  });

  it('Update the state', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'value'));

    act(() => {
      const setState = result.current[1];
      setState('edited');
    });

    expect(result.current[0]).toBe('edited');
  });

  it('Update the state writes localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'value'));

    act(() => {
      const setState = result.current[1];
      setState('edited');
    });

    expect(window.localStorage.getItem('key')).toBe(JSON.stringify('edited'));
  });

  it('Update the state with null', () => {
    const { result } = renderHook(() => useLocalStorage<string | null>('key', 'value'));

    act(() => {
      const setState = result.current[1];
      setState(null);
    });

    expect(result.current[0]).toBeNull();
  });

  it('Update the state with a callback function', () => {
    const { result } = renderHook(() => useLocalStorage('count', 2));

    act(() => {
      const setState = result.current[1];
      setState(prev => (prev || 0) + 1);
    });

    expect(result.current[0]).toBe(3);
    expect(window.localStorage.getItem('count')).toEqual('3');
  });

  it('[Event] Update one hook updates the others', () => {
    const initialValues: [string, string] = ['key', 'initial'];
    const { result: A } = renderHook(() => useLocalStorage(...initialValues));
    const { result: B } = renderHook(() => useLocalStorage(...initialValues));

    act(() => {
      const setState = A.current[1];
      setState('edited');
    });

    expect(B.current[0]).toBe('edited');
  });

  it('setValue is referentially stable', () => {
    const { result } = renderHook(() => useLocalStorage('count', 1));

    // Store a reference to the original setValue
    const originalCallback = result.current[1];

    // Now invoke a state update, if setValue is not referentially stable then this will cause the originalCallback
    // reference to not be equal to the new setValue function
    act(() => {
      const setState = result.current[1];
      setState(prev => (prev || 0) + 1);
    });

    expect(result.current[1] === originalCallback).toBe(true);
  });

  it('retrieves an existing value from localStorage', () => {
    localStorage.setItem('foo', '"bar"');
    const { result } = renderHook(() => useLocalStorage('foo', ''));
    const [state] = result.current;
    expect(state).toEqual('bar');
  });

  it('prefers existing value over initial state', () => {
    localStorage.setItem('foo', '"bar"');
    const { result } = renderHook(() => useLocalStorage('foo', 'baz'));
    const [state] = result.current;
    expect(state).toEqual('bar');
  });

  it('correctly updates localStorage', () => {
    const { result, rerender } = renderHook(() => useLocalStorage('foo', 'bar'));

    const [, setFoo] = result.current;
    act(() => setFoo('baz'));
    rerender();

    const [state] = result.current;
    expect(state).toEqual('baz');
  });

  it('returns and allows null setting', () => {
    localStorage.setItem('foo', 'null');
    const { result, rerender } = renderHook(() => useLocalStorage('foo', null));
    const [foo1, setFoo] = result.current;
    act(() => setFoo(null));
    rerender();

    const [foo2] = result.current;
    expect(foo1).toEqual(null);
    expect(foo2).toEqual(null);
  });

  it('sets initialState if initialState is an object', () => {
    const { result } = renderHook(() => useLocalStorage('foo', { bar: true }));

    const [foo] = result.current;
    expect(foo).toEqual({ bar: true });
  });

  it('correctly and promptly returns a new value', () => {
    const { result, rerender } = renderHook(() => useLocalStorage('foo', 'bar'));

    const [, setFoo] = result.current;
    act(() => setFoo('baz'));
    rerender();

    const [foo] = result.current;
    expect(foo).toEqual('baz');
  });

  it('reInitializes state when key changes', () => {
    let key = 'foo';
    const { result, rerender } = renderHook(() => useLocalStorage(key, 'bar'));

    const [, setState] = result.current;
    act(() => setState('baz'));
    key = 'bar';
    rerender();

    const [state] = result.current;
    expect(state).toEqual('bar');
  });

  it('reInitializes state when key changes and prefers existing value over initial state', () => {
    let key = 'key-1';
    const { result: resultA } = renderHook(() => useLocalStorage('key-2', 'value-2'));

    const [, setStateA] = resultA.current;
    act(() => setStateA('value-2'));

    const { result, rerender } = renderHook(() => useLocalStorage(key, 'value-1'));

    const [, setState] = result.current;
    act(() => setState('value-3'));

    key = 'key-2';
    rerender();

    const [state] = result.current;
    expect(state).toEqual('value-2');
  });

  it('parses out objects from localStorage', () => {
    localStorage.setItem('foo', JSON.stringify({ ok: true }));
    const { result } = renderHook(() => useLocalStorage<{ ok: boolean }>('foo', { ok: false }));
    const [foo] = result.current;
    expect(foo!.ok).toEqual(true);
  });

  it('safely initializes objects to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage<{ ok: boolean }>('foo', { ok: true }));
    const [foo] = result.current;
    expect(foo!.ok).toEqual(true);
  });

  it('safely sets objects to localStorage', () => {
    const { result, rerender } = renderHook(() => useLocalStorage<{ ok: any }>('foo', { ok: true }));

    const [, setFoo] = result.current;
    act(() => setFoo({ ok: 'bar' }));
    rerender();

    const [foo] = result.current;
    expect(foo!.ok).toEqual('bar');
  });

  it('safely returns objects from updates', () => {
    const { result, rerender } = renderHook(() => useLocalStorage<{ ok: any }>('foo', { ok: true }));

    const [, setFoo] = result.current;
    act(() => setFoo({ ok: 'bar' }));
    rerender();

    const [foo] = result.current;
    expect(foo).toBeInstanceOf(Object);
    expect(foo!.ok).toEqual('bar');
  });

  it('sets localStorage from the function updater', () => {
    const { result, rerender } = renderHook(() =>
      useLocalStorage<{ foo: string; fizz?: string }>('foo', { foo: 'bar' })
    );

    const [, setFoo] = result.current;
    act(() => setFoo(state => ({ ...state!, fizz: 'buzz' })));
    rerender();

    const [value] = result.current;
    expect(value!.foo).toEqual('bar');
    expect(value!.fizz).toEqual('buzz');
  });
});

/* Enforces proper eslint react-hooks/rules-of-hooks usage */
describe('eslint react-hooks/rules-of-hooks', () => {
  it('memoizes an object between rerenders', () => {
    const { result, rerender } = renderHook(() => useLocalStorage('foo', { ok: true }));

    rerender();
    const [r2] = result.current;
    rerender();
    const [r3] = result.current;
    expect(r2).toBe(r3);
  });

  it('memoizes an object immediately if localStorage is already set', () => {
    localStorage.setItem('foo', JSON.stringify({ ok: true }));
    const { result, rerender } = renderHook(() => useLocalStorage('foo', { ok: true }));

    const [r1] = result.current; // if localStorage isn't set then r1 and r2 will be different
    rerender();
    const [r2] = result.current;
    expect(r1).toBe(r2);
  });

  it('memoizes the setState function', () => {
    localStorage.setItem('foo', JSON.stringify({ ok: true }));
    const { result, rerender } = renderHook(() => useLocalStorage('foo', { ok: true }));
    const [, s1] = result.current;
    rerender();
    const [, s2] = result.current;
    expect(s1).toBe(s2);
  });
});
