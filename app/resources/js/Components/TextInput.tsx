import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
  } from 'react';
  
  export default forwardRef(function TextInput(
    {
      type = 'text',
      className = '',
      isFocused = false,
      ...props
    }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref,
  ) {
    const localRef = useRef<HTMLInputElement>(null);
  
    useImperativeHandle(ref, () => ({
      focus: () => localRef.current?.focus(),
    }));
  
    useEffect(() => {
      if (isFocused) {
        localRef.current?.focus();
      }
    }, [isFocused]);
  
    return (
      <input
        {...props}
        ref={localRef}
        type={type}
        className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      />
    );
  });
  